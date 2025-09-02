'use client';

import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Alert 
} from '@mui/material';
import { useVault } from '@/contexts/VaultContext';
import { createCredential } from '@/services/credentialService';
import { encryptField } from '@/lib/crypto';

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
      });
      
      // Reset form
      setTitle('');
      setPassword('');
      
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
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Credential</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={2}>
            <TextField
              label="Credential Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              autoFocus
              helperText="e.g., Email, Admin Account, API Key, etc."
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              helperText="The password or value for this credential"
            />
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Credential'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
