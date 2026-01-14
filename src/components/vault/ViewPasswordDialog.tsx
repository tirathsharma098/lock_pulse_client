'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vaultService} from '@/services';
import { decryptCompat, getEncryptedSize, initSodium } from '@/lib/crypto';
import { DecryptedItem } from '@/services/vault.service';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Textarea, IconButton } from '@/components/ui';

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
      // console.error('Failed to load item:', err);
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
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <DialogHeader>
        <div className="flex items-center justify-between">
          <DialogTitle>Password Details</DialogTitle>
          {item?.isLong && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
              Long Text
            </span>
          )}
        </div>
      </DialogHeader>
      
      <DialogContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : item ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    label="Title"
                    value={item.title}
                    readOnly
                  />
                </div>
                <IconButton 
                  onClick={() => copyToClipboard(item.title, 'Title')}
                  variant="ghost"
                  className="mb-1"
                >
                  <CopyIcon />
                </IconButton>
              </div>
              {item.titleSize && (
                <p className="text-xs text-gray-500 mt-1">
                  Encrypted size: {item.titleSize} bytes
                </p>
              )}
            </div>

            <div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  {item.isLong && showPassword ? (
                    <Textarea
                      label="Password"
                      value={item.password}
                      rows={10}
                      readOnly
                    />
                  ) : (
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={item.password}
                      readOnly
                    />
                  )}
                </div>
                <IconButton 
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                  className="mb-1"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
                <IconButton 
                  onClick={() => copyToClipboard(item.password, 'Password')}
                  variant="ghost"
                  className="mb-1"
                >
                  <CopyIcon />
                </IconButton>
              </div>
              {item.passwordSize && (
                <p className="text-xs text-gray-500 mt-1">
                  Encrypted size: {item.passwordSize} bytes
                </p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Created: {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No item data available</p>
        )}
      </DialogContent>
      
      <DialogFooter>
        <Button variant="outline" onClick={handleClose}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
}
