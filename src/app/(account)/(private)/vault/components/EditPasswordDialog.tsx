'use client';

import { useEffect, useState } from 'react';
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
  IconButton,
} from '@mui/material';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vaultService, type VaultItemData } from '@/services';
import { decryptCompat, encryptField, getEncryptedSize, initSodium } from '@/lib/crypto';
import { z } from 'zod'; // add zod
import { DecryptedItem } from '@/services/vault.service';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

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

interface EditPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
  itemId: string|null;
}

export default function EditPasswordDialog({ open, onClose, onEdit, itemId }: EditPasswordDialogProps) {
  const { vaultKey, wipeVaultKey } = useVault();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [longMode, setLongMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = () => {
    setTitle('');
    setPassword('');
    setLongMode(false);
    setFieldErrors({});
    onClose();
    setShowPassword(false);
  };

    useEffect(() => {
      if (open && itemId && vaultKey) {
        loadItem();
      } else if (!open) {
        toast.error('Invalid request');
        handleClose();
      }
    }, [open, itemId, vaultKey]);

    const loadItem = async () => {
      if (!itemId || !vaultKey || vaultKey.length !== 32) {
        toast.error('Invalid request');
        return;
      }
  
      setLoading(true);
      try {
        await initSodium();
        const vaultItem = await vaultService.getItem(itemId);
        const password = await decryptCompat(vaultItem.passwordNonce!, vaultItem.passwordCiphertext!, vaultKey);
        const title = await decryptCompat(vaultItem.titleNonce, vaultItem.titleCiphertext, vaultKey);
        const decryptedItem: DecryptedItem = {
          id: vaultItem.id,
          title,
          password,
          isLong: vaultItem.isLong,
          createdAt: vaultItem.createdAt,
          passwordSize: getEncryptedSize(password),
          titleSize: getEncryptedSize(title),
        };
        setTitle(decryptedItem.title);
        setPassword(decryptedItem.password);
        setLongMode(!!decryptedItem.isLong);
      } catch (err: any) {
        console.error('Failed to load item:', err);
        if (err?.status === 401) {
          toast.error('Session expired. Please log in again.');
          wipeVaultKey();
          return;
        }
        toast.error(err?.message || 'Failed to load password details');
        onClose();
      } finally {
        setLoading(false);
      }
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
      await vaultService.updateItem(itemId!, itemData);
      toast.success('Password added successfully');
      handleClose();
      onEdit();
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
            <Box className="flex items-center gap-2">
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
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
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              size="small"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
            </Box>
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
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
