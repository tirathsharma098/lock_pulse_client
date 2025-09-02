'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { createProject } from '@/services/projectService';
import { encryptField, wrapVaultKey, generateVaultKey, generateSalt, getDefaultKdfParams, deriveKEK, combineNonceAndCiphertext } from '@/lib/crypto';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button, Input, Textarea, Switch } from '@/components/ui';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

export default function CreateProjectDialog({ 
  open, 
  onClose,
  onProjectCreated
}: CreateProjectDialogProps) {
  const { vaultKey } = useVault();
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
    
    if (!vaultKey) {
      setError('Vault key not available. Please log in again.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a new vault key for the project
      const projectVaultKey = await generateVaultKey();
      
      // Encrypt project password with user's vault key
      const passwordEncrypted = await encryptField(password, vaultKey);

      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(password, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(projectVaultKey, kek);
      // Wrap the project vault key with the project password
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);
      // Create project in the backend
      await createProject({
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
      
      onProjectCreated();
    } catch (err) {
      console.error('Failed to create project:', err);
      setError('Failed to create project. Please try again.');
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
        <DialogTitle>Create New Project</DialogTitle>
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
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              required
              autoFocus
            />
            
            {isLong ? (
              <Textarea
                label="Project Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter project password"
                required
                rows={4}
                helperText="This password will be used to encrypt project data"
              />
            ) : (
              <Input
                label="Project Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter project password"
                required
                helperText="This password will be used to encrypt project data"
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
              placeholder="Add any notes about this project"
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
            Create Project
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
