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

  const handleClose = () => {
    setTitle('');
    setPassword('');
    setLongMode(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!title || !password || !vaultKey) {
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
      onAdd(); // Refresh the main list
    } catch (err: any) {
      console.log('Failed to add item:', err);
      if (err?.status === 401) {
        toast.error('Session expired. Please log in again.');
        wipeVaultKey();
        return;
      }
      toast.error(err?.message || 'Failed to add password');
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
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Gmail Account"
            autoFocus
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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              multiline={longMode}
              rows={longMode ? 4 : 1}
            />
            {password && (
              <Typography variant="caption" color="textSecondary" className="mt-1 block">
                Encrypted size: {passwordSize} bytes
              </Typography>
            )}
          </Box>
          
          <FormControlLabel
            control={
              <Switch
                checked={longMode}
                onChange={(e) => setLongMode(e.target.checked)}
              />
            }
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
