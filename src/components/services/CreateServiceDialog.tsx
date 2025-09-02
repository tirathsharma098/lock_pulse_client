'use client';

import { useState } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Alert, FormControlLabel, Switch 
} from '@mui/material';
import { useVault } from '@/contexts/VaultContext';
import { createService } from '@/services/serviceService';
import { 
  encryptField, wrapVaultKey, generateVaultKey, 
  generateSalt, getDefaultKdfParams, deriveKEK, combineNonceAndCiphertext 
} from '@/lib/crypto';

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Service</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={2}>
            <TextField
              label="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              label="Service Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              multiline={isLong}
              rows={isLong ? 4 : 1}
              helperText="This password will be used to encrypt service data"
            />
          </Box>

          <Box mb={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={isLong}
                  onChange={(e) => setIsLong(e.target.checked)}
                  color="primary"
                />
              }
              label="Long Password"
            />
          </Box>
          
          <TextField
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Service'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
