'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Box,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vaultService, type VaultItemData } from '@/services';
import { encryptField, getEncryptedSize, initSodium } from '@/lib/crypto';
import { z } from 'zod'; // add zod

// local schema
const addPasswordSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  password: z.string()
  .min(4, { message: 'Password is required' }),
  isLong: z.boolean(),
}).refine((data) => {
  if (data.title) {
    return getEncryptedSize(data.title) <= 400;
  }
  return true;
}, {
  message: 'Encrypted title must be less than 400 bytes',
  path: ['title'],
}).refine((data) => {
  if (data.isLong) {
    return getEncryptedSize(data.password) <= 20 * 1024;
  }
  return true; // Skip this check if isLong is false
}, {
  message: 'Encrypted password must be less than 20 KB',
  path: ['password'],
})
.refine((data) => {
  if (!data.isLong) {
    return getEncryptedSize(data.password) <= 200;
  }
  return true; // Skip this check if isLong is true
}, {
  message: 'Encrypted password must be less than 200 bytes',
  path: ['password'],
});

interface AddPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void; // Callback to refresh the main list
}

export default function AddPasswordDialog({ open, onClose, onAdd }: AddPasswordDialogProps) {
  const { vaultKey, wipeVaultKey } = useVault();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [longMode, setLongMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; password?: string }>({});

  const handleClose = () => {
    setTitle('');
    setPassword('');
    setLongMode(false);
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    setFieldErrors({});

    // zod validation (replace inline empty checks)
    const result = addPasswordSchema.safeParse({ title, password, isLong:longMode });
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      toast.error('Please fill in all fields');
      return;
    }

    if (!vaultKey) {
      toast.error('Please fill in all fields');
      return;
    }
    if (vaultKey.length !== 32) {
      toast.error('Invalid vault key');
      wipeVaultKey();
      return;
    }

    setLoading(true);
    try {
      await initSodium();
      const titleEncrypted = await encryptField(title, vaultKey);
      const passwordEncrypted = await encryptField(password, vaultKey);
      // ...existing code...
      const itemData: VaultItemData = {
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong: longMode,
      };
      await vaultService.createItem(itemData);
      toast.success('Password added successfully');
      handleClose();
      onAdd();
    } catch (err: any) {
      // ...existing code...
    } finally {
      setLoading(false);
    }
  };

  const titleSize = title ? getEncryptedSize(title) : 0;
  const passwordSize = password ? getEncryptedSize(password) : 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Password</DialogTitle>
      <DialogContent>
        <Box className="space-y-4 pt-2">
          <Box>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="e.g., Gmail Account"
              autoFocus
              error={!!fieldErrors.title}
              helperText={fieldErrors.title ?? ''}
            />
            {password && (
              <Typography variant="caption" color="textSecondary" className="mt-1 block">
                Encrypted size: {titleSize} bytes
              </Typography>
            )}
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
              }}
              placeholder="Enter password"
              multiline={longMode}
              rows={longMode ? 10 : 1}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password ?? ''}
            />
            {password && (
              <Typography variant="caption" color="textSecondary" className="mt-1 block">
                Encrypted size: {passwordSize} bytes
              </Typography>
            )}
          </Box>
          <FormControlLabel
            control={<Switch checked={longMode} onChange={(e) => setLongMode(e.target.checked)} />}
            label="Long text mode (for notes, keys, etc.)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !title || !password}
        >
          {loading ? 'Adding...' : 'Add Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
