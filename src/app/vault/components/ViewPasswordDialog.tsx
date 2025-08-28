'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vaultService, type VaultItem } from '@/services';
import { decryptCompat, getEncryptedSize, initSodium } from '@/lib/crypto';

interface DecryptedItem {
  id: string;
  title: string;
  password: string;
  createdAt: string;
  isLong?: boolean;
  passwordSize?: number;
  titleSize?: number;
}

interface ViewPasswordDialogProps {
  open: boolean;
  onClose: () => void;
  itemId: string | null;
}

export default function ViewPasswordDialog({ open, onClose, itemId }: ViewPasswordDialogProps) {
  const { vaultKey, wipeVaultKey } = useVault();
  const [item, setItem] = useState<DecryptedItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open && itemId && vaultKey) {
      loadItem();
    } else if (!open) {
      // Reset state when dialog closes
      setItem(null);
      setShowPassword(false);
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
      
      setItem(decryptedItem);
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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleClose = () => {
    setItem(null);
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box className="flex items-center justify-between">
          Password Details
          {item?.isLong && (
            <Chip label="Long Text" color="info" size="small" />
          )}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box className="flex justify-center py-8">
            <CircularProgress />
          </Box>
        ) : item ? (
          <Box className="space-y-4">
            <Box>
              <Typography variant="subtitle2" className="mb-1">
                Title
              </Typography>
              <Box className="flex items-center gap-2">
                <TextField
                  fullWidth
                  value={item.title}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
                <IconButton 
                  onClick={() => copyToClipboard(item.title, 'Title')}
                  size="small"
                >
                  <CopyIcon />
                </IconButton>
              </Box>
              {item.titleSize && (
                <Typography variant="caption" color="textSecondary" className="mt-1 block">
                  Encrypted size: {item.titleSize} bytes
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" className="mb-1">
                Password
              </Typography>
              <Box className="flex items-center gap-2">
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  value={item.password}
                  variant="outlined"
                  size="small"
                  multiline={item.isLong && showPassword}
                  rows={item.isLong && showPassword ? 4 : 1}
                  InputProps={{ readOnly: true }}
                />
                <IconButton 
                  onClick={() => setShowPassword(!showPassword)}
                  size="small"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                <IconButton 
                  onClick={() => copyToClipboard(item.password, 'Password')}
                  size="small"
                >
                  <CopyIcon />
                </IconButton>
              </Box>
              {item.passwordSize && (
                <Typography variant="caption" color="textSecondary" className="mt-1 block">
                  Encrypted size: {item.passwordSize} bytes
                </Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Created: {new Date(item.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography>No item data available</Typography>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
