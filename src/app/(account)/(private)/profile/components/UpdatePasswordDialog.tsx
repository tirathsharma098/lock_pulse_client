'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Step,
  Stepper,
  StepLabel
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { z } from 'zod';
import * as opaque from '@serenity-kit/opaque';
import { userService } from '@/services';
import { 
  generateVaultKey, 
  generateSalt, 
  deriveKEK, 
  wrapVaultKey, 
  combineNonceAndCiphertext, 
  getDefaultKdfParams, 
  initSodium, 
  getEncryptedSize 
} from '@/lib/crypto';
import { useVault } from '@/contexts/VaultContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui';

const confirmationSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    confirmUsername: z.string().min(1, 'Username confirmation is required'),
  }).refine((data) => data.confirmUsername === data.username, {
    message: 'Username confirmation does not match',
    path: ['confirmUsername'],
  });

const passwordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((val) => getEncryptedSize(val) <= 1024, {
      message: 'Encrypted password must be less than 1 KB',
    }),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((v) => v.newPassword === v.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

interface UpdatePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

export default function UpdatePasswordDialog({ open, onClose, username }: UpdatePasswordDialogProps) {
  const [step, setStep] = useState(0);
  const [confirmUsername, setConfirmUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string|undefined>>({});
  const { setVaultData, vaultKey } = useVault();

  const handleClose = () => {
    if (!loading) {
      setStep(0);
      setConfirmUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setFieldErrors({});
      onClose();
    }
  };

  const handleConfirmation = () => {
    setError('');
    setFieldErrors({});

    const result = confirmationSchema.safeParse({ 
      confirmUsername,
      username 
    });

    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setError('Please confirm your username to proceed');
      return;
    }

    setStep(1);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (step === 0) {
      handleConfirmation();
    } else {
      void handlePasswordUpdate();
    }
  };

  const handlePasswordUpdate = async () => {
    setError('');
    setFieldErrors({});
    setLoading(true);

    const result = passwordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setLoading(false);
      setError('Please fix the form errors');
      return;
    }

    try {
      await initSodium();

      // Start OPAQUE registration for password update
      const { registrationRequest, clientRegistrationState } = opaque.client.startRegistration({ 
        password: newPassword 
      });

      // Send registration request to server
      const { registrationResponse } = await userService.updatePasswordStart({
        registrationRequest,
      });

      // Generate new vault key and encryption parameters
      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(newPassword, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(vaultKey!, kek);
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);

      // Finish OPAQUE registration
      const { registrationRecord } = opaque.client.finishRegistration({
        clientRegistrationState,
        registrationResponse,
        password: newPassword,
      });

      // Send final password update data
      await userService.updatePasswordFinish({
        registrationRecord,
        registrationRequest,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
      });
      // Clear sensitive data
      kek.fill(0);
      toast.success('Master password updated successfully');
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Password update failed');
      toast.error(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Confirm Identity', 'Set New Password'];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-center">
        <Box className="flex items-center justify-center space-x-2 mb-2">
          <Warning className="text-orange-500" />
          <Typography variant="h6">Update Master Password</Typography>
        </Box>
        <Stepper activeStep={step} className="mt-4">
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {step === 0 && (
            <Box className="space-y-4">
              <Alert severity="warning" className="mb-4">
                <Typography variant="body2" className="font-semibold mb-2">
                  ⚠️ This action cannot be undone!
                </Typography>
                <Typography variant="body2">
                  • Your vault will be re-encrypted with the new password
                  <br />
                  • You will need the new password for all future access
                  <br />
                  • Make sure you remember or securely store your new password
                </Typography>
              </Alert>

              <Typography variant="body1" className="mb-4">
                To confirm this action, please type your username: <strong>{username}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Confirm Username"
                value={confirmUsername}
                onChange={(e) => {
                  setConfirmUsername(e.target.value);
                  if (fieldErrors.confirmUsername) {
                    setFieldErrors((p) => ({ ...p, confirmUsername: undefined }));
                  }
                }}
                disabled={loading}
                error={!!fieldErrors.confirmUsername}
                helperText={fieldErrors.confirmUsername}
                placeholder={`Type "${username}" to confirm`}
              />
            </Box>
          )}

          {step === 1 && (
            <Box className="space-y-4">
              <Typography variant="body1" className="mb-4">
                Enter your new master password:
              </Typography>

              <TextField
                fullWidth
                type="password"
                label="New Master Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (fieldErrors.newPassword) {
                    setFieldErrors((p) => ({ ...p, newPassword: undefined }));
                  }
                }}
                disabled={loading}
                error={!!fieldErrors.newPassword}
                helperText={fieldErrors.newPassword}
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                  }
                }}
                disabled={loading}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                autoComplete="new-password"
              />

              {newPassword && (
                <Typography variant="caption" color="textSecondary">
                  Encrypted size: {getEncryptedSize(newPassword)} bytes
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions className="p-6">
          <Button onClick={handleClose} disabled={loading} type="button">
            Cancel
          </Button>
          {step === 0 ? (
            <Button
              type="submit"
              variant="primary"
              color="warning"
              disabled={loading || !confirmUsername}
            >
              Confirm & Continue
            </Button>
          ) : (
            <Button
              type="submit"
              variant="ghost"
              color="primary"
              disabled={loading || !newPassword || !confirmPassword}
            >
               <Box sx={{ display: "flex", alignItems: "center", minWidth: 150, justifyContent: "center" }}>
                {loading ? <CircularProgress size={20} sx={{color: "black"}}/> : "Update Password"}
              </Box>
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
