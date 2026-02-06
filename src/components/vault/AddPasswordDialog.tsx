'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vaultService, type VaultItemData } from '@/services';
import { encryptField, getEncryptedSize, initSodium } from '@/lib/crypto';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Textarea, Switch } from '@/components/ui';

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
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle>Add New Password</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <DialogContent>
        <div className="space-y-4">
          <div>
            <Input
              label="Title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (fieldErrors.title) setFieldErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="e.g., Gmail Account"
              error={fieldErrors.title}
              autoFocus
              autoComplete="off"
            />
            {title && (
              <p className="text-xs text-gray-500 mt-1">
                Encrypted size: {titleSize} bytes
              </p>
            )}
          </div>
          
          <div>
            {longMode ? (
              <Textarea
                label="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder="Enter password"
                rows={10}
                error={fieldErrors.password}
                autoComplete="off"
              />
            ) : (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
                placeholder="Enter password"
                error={fieldErrors.password}
                autoComplete="off"
              />
            )}
            {password && (
              <p className="text-xs text-gray-500 mt-1">
                Encrypted size: {passwordSize} bytes
              </p>
            )}
          </div>
          
          <Switch
            checked={longMode}
            onCheckedChange={setLongMode}
            label="Long text mode (for notes, keys, etc.)"
          />
        </div>
      </DialogContent>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading || !title || !password}
          loading={loading}
        >
          Add Password
        </Button>
      </DialogFooter>
      </form>
    </Dialog>
  );
}
