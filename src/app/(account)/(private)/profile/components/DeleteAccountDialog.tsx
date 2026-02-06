'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { Warning } from '@mui/icons-material';
import { toast } from 'sonner';
import { userService } from '@/services';
import { redirectUserToLogin } from '../profile-action';

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
}

const CONFIRMATION_PHRASE =
  'Yes, I understand the consequences of deleting my account. I understand that my data cannot be recovered after this action.';

const generateCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [randomCode, setRandomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setConfirmText('');
      setCodeInput('');
      setError('');
      setRandomCode(generateCode());
    }
  }, [open]);

  const isPhraseMatch = useMemo(
    () => confirmText.trim() === CONFIRMATION_PHRASE,
    [confirmText]
  );

  const isCodeMatch = useMemo(
    () => codeInput.trim() === randomCode,
    [codeInput, randomCode]
  );

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleDelete = async () => {
    setError('');

    if (!isPhraseMatch || !isCodeMatch) {
      setError('Please complete both confirmations exactly to proceed.');
      return;
    }

    try {
      setLoading(true);
      await userService.deleteAccount();
      toast.success('Account deleted successfully');
      handleClose();
      redirectUserToLogin();
    } catch (err: any) {
      const message = err?.message || 'Account deletion failed';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className="text-center">
        <Box className="flex items-center justify-center space-x-2 mb-2">
          <Warning className="text-red-500" />
          <Typography variant="h6">Delete Account</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <Alert severity="warning" className="mb-4">
          <Typography variant="body2" className="font-semibold mb-2">
            ⚠️ This action is permanent and cannot be undone.
          </Typography>
          <Typography variant="body2">
            Deleting your account permanently removes your vault and profile data. You will lose
            access immediately and your data cannot be recovered.
          </Typography>
        </Alert>

        <Box className="space-y-4">
          <Box>
            <Typography variant="body2" className="mb-2">
              Please type the following sentence exactly to confirm:
            </Typography>
            <Box className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Typography variant="body2" className="font-medium">
                {CONFIRMATION_PHRASE}
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Confirmation sentence"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type the full sentence exactly as shown"
            error={!!confirmText && !isPhraseMatch}
            helperText={confirmText && !isPhraseMatch ? 'Sentence does not match exactly' : ' '}
            disabled={loading}
          />

          <Box>
            <Typography variant="body2" className="mb-2">
              Type this code to confirm (case-sensitive):
            </Typography>
            <Box className="inline-flex px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
              <Typography variant="body2" className="font-mono font-semibold tracking-wider">
                {randomCode}
              </Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Confirmation code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Type the code exactly"
            error={!!codeInput && !isCodeMatch}
            helperText={codeInput && !isCodeMatch ? 'Code does not match' : ' '}
            disabled={loading}
          />
        </Box>
      </DialogContent>

      <DialogActions className="p-6">
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading || !isPhraseMatch || !isCodeMatch}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 140, justifyContent: 'center' }}>
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Delete Account'}
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
