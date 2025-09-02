'use client';

import { useState, useContext } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Alert, FormControlLabel, Switch 
} from '@mui/material';
import {useVault} from '@/contexts/VaultContext';
import { createProject } from '@/services/projectService';
import { encryptField, wrapVaultKey, generateVaultKey, generateSalt, getDefaultKdfParams, deriveKEK, combineNonceAndCiphertext } from '@/lib/crypto';

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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New Project</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={2}>
            <TextField
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              autoFocus
            />
          </Box>
          
          <Box mb={2}>
            <TextField
              label="Project Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              helperText="This password will be used to encrypt project data"
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
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
