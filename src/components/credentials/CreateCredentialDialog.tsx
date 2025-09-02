'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { createCredential } from '@/services/credentialService';
import { encryptField } from '@/lib/crypto';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Textarea, Switch } from '@/components/ui';

interface CreateCredentialDialogProps {
  open: boolean;
  onClose: () => void;
  onCredentialCreated: () => void;
  projectId: string;
  serviceId: string;
}

export default function CreateCredentialDialog({ 
  open, 
  onClose,
  onCredentialCreated,
  projectId,
  serviceId
}: CreateCredentialDialogProps) {
  const { serviceVaultKey } = useVault();
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLong, setIsLong] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !password) {
      setError('Title and password are required');
      return;
    }
    
    if (!serviceVaultKey) {
      setError('Service vault key not available. Please unlock the service first.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Encrypt title and password with service vault key
      const titleEncrypted = await encryptField(title, serviceVaultKey);
      const passwordEncrypted = await encryptField(password, serviceVaultKey);
      
      // Create credential in the backend
      await createCredential(projectId, serviceId, {
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong,
      });
      
      // Reset form
      setTitle('');
      setPassword('');
      setIsLong(false);
      
      onCredentialCreated();
    } catch (err) {
      console.error('Failed to create credential:', err);
      setError('Failed to create credential. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setPassword('');
    setIsLong(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Credential</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Credential Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Email, Admin Account, API Key, etc."
              required
              autoFocus
            />
            
            {isLong ? (
              <Textarea
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="The password or value for this credential"
                required
                rows={4}
                helperText="The password or value for this credential"
              />
            ) : (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="The password or value for this credential"
                required
                helperText="The password or value for this credential"
              />
            )}

            <Switch
              checked={isLong}
              onCheckedChange={setIsLong}
              label="Long Password"
            />
          </div>
        </DialogContent>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            Create Credential
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
