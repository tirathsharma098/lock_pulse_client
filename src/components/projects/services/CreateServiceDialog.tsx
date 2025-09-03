'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { createService } from '@/services/serviceService';
import { 
  encryptField, wrapVaultKey, generateVaultKey, 
  generateSalt, getDefaultKdfParams, deriveKEK, combineNonceAndCiphertext 
} from '@/lib/crypto';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Textarea, Switch } from '@/components/ui';

interface CreateServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onServiceCreated: () => void;
  projectId: string;
}

export default function CreateServiceDialog({ 
  open, 
  onClose,
  onServiceCreated,
  projectId
}: CreateServiceDialogProps) {
  const { projectVaultKey } = useVault();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLong, setIsLong] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !password) {
      setError('Name and password are required');
      return;
    }
    
    if (!projectVaultKey) {
      setError('Project vault key not available. Please unlock the project first.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a new vault key for the service
      const serviceVaultKey = await generateVaultKey();
      
      // Encrypt service password with project's vault key
      const passwordEncrypted = await encryptField(password, projectVaultKey);

      // Generate salt and derive KEK for wrapping service vault key
      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(password, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(serviceVaultKey, kek);
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);
      
      // Create service in the backend
      await createService(projectId, {
        name,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong,
        notes: notes || undefined
      });
      
      // Reset form
      setName('');
      setPassword('');
      setNotes('');
      setIsLong(false);
      
      onServiceCreated();
    } catch (err) {
      console.error('Failed to create service:', err);
      setError('Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPassword('');
    setNotes('');
    setIsLong(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-md">
      <DialogHeader>
        <DialogTitle>Create New Service</DialogTitle>
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
              label="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              required
              autoFocus
            />
            
            {isLong ? (
              <Textarea
                label="Service Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter service password"
                required
                rows={4}
                helperText="This password will be used to encrypt service data"
              />
            ) : (
              <Input
                label="Service Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter service password"
                required
                helperText="This password will be used to encrypt service data"
              />
            )}

            <Switch
              checked={isLong}
              onCheckedChange={setIsLong}
              label="Long Password"
            />
            
            <Textarea
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this service"
              rows={3}
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
            Create Service
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
