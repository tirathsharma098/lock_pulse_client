'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Paper, Box, Button, 
  TextField, Alert, CircularProgress, IconButton, InputAdornment,
  FormControlLabel, Switch
} from '@mui/material';
import { useParams } from "next/navigation";
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { getService, updateService, Service } from '@/services/serviceService';
import { 
  decryptCompat, 
  encryptField, 
  unwrapVaultKey, 
  wrapVaultKey, 
  generateSalt, 
  getDefaultKdfParams, 
  deriveKEK, 
  combineNonceAndCiphertext,
} from '@/lib/crypto';
import { toast } from 'sonner';

export default function ServiceEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const router = useRouter();
  const { projectVaultKey } = useVault();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLong, setIsLong] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [originalPassword, setOriginalPassword] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getService(projectId, serviceId);
        setService(data);
        setName(data.name);
        setNotes(data.notes || '');
        setIsLong(data.isLong || false);
        
        // Decrypt the original password
        if (data && projectVaultKey) {
          const decryptedPassword = await decryptCompat(
            data.passwordNonce,
            data.passwordCiphertext,
            projectVaultKey
          );
          setOriginalPassword(decryptedPassword);
          setPassword(decryptedPassword);
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [projectId, serviceId, projectVaultKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Service password is required');
      return;
    }
    
    if (!service || !projectVaultKey) {
      setError('Service data or project vault key not available');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Check if password has changed
      const passwordChanged = password !== originalPassword;
      
      let updateData: any = {
        name: name.trim(),
        notes: notes.trim() || undefined
      };
      
      // If password changed, we need to re-encrypt everything
      if (passwordChanged) {
        // Unwrap the current service vault key using the original password
        const originalKdfSalt = new Uint8Array(Buffer.from(service.vaultKdfSalt, 'base64'));
        const originalKek = await deriveKEK(originalPassword, originalKdfSalt, service.vaultKdfParams);
        const serviceVaultKey = await unwrapVaultKey(service.wrappedVaultKey, originalKek);
        
        // Encrypt the new password with project's vault key
        const newPasswordEncrypted = await encryptField(password, projectVaultKey);
        
        // Generate new salt and wrap vault key with new password
        const newVaultKdfSalt = await generateSalt();
        const newKdfParams = await getDefaultKdfParams();
        const newKek = await deriveKEK(password, newVaultKdfSalt, newKdfParams);
        const { nonce: newNonce, ciphertext: newCiphertext } = await wrapVaultKey(serviceVaultKey, newKek);
        const newWrappedVaultKey = await combineNonceAndCiphertext(newNonce, newCiphertext);
        
        updateData = {
          ...updateData,
          wrappedVaultKey: newWrappedVaultKey,
          vaultKdfSalt: Buffer.from(newVaultKdfSalt).toString('base64'),
          vaultKdfParams: newKdfParams,
          passwordNonce: newPasswordEncrypted.nonce,
          passwordCiphertext: newPasswordEncrypted.ciphertext,
          isLong,
        };
      } else {
        updateData.isLong = isLong;
      }
      
      await updateService(projectId, serviceId, updateData);
      
      toast.success('Service updated successfully');
      router.push(`/project/${projectId}/service/${serviceId}/view`);
      
    } catch (err) {
      console.error('Failed to update service:', err);
      setError('Failed to update service. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/project/${projectId}/service/${serviceId}/view`);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !service) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push(`/project/${projectId}/service`)}
          >
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Edit Service
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={3}>
            <TextField
              label="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              variant="outlined"
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Service Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              helperText="Change this password to update service encryption"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box mb={3}>
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
          
          <Box mb={3}>
            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
          
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={handleBack}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}