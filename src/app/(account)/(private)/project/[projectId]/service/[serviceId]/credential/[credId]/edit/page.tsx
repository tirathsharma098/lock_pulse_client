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
import { getCredential, updateCredential, Credential } from '@/services/credentialService';
import { decryptCompat, encryptField } from '@/lib/crypto';
import { toast } from 'sonner';

export default function CredentialEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const credId = params.credId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLong, setIsLong] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const data = await getCredential(projectId, serviceId, credId);
        setCredential(data);
        setIsLong(data.isLong || false);
        
        // Decrypt the credential data
        if (data && serviceVaultKey) {
          const [decryptedTitle, decryptedPassword] = await Promise.all([
            decryptCompat(data.titleNonce, data.titleCiphertext, serviceVaultKey),
            decryptCompat(data.passwordNonce, data.passwordCiphertext, serviceVaultKey)
          ]);
          
          setTitle(decryptedTitle);
          setPassword(decryptedPassword);
        }
      } catch (err) {
        console.error('Error fetching credential:', err);
        setError('Failed to load credential details');
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [projectId, serviceId, credId, serviceVaultKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (!serviceVaultKey) {
      setError('Service vault key not available');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Encrypt title and password with service vault key
      const titleEncrypted = await encryptField(title.trim(), serviceVaultKey);
      const passwordEncrypted = await encryptField(password, serviceVaultKey);
      
      await updateCredential(projectId, serviceId, credId, {
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong,
      });
      
      toast.success('Credential updated successfully');
      router.push(`/project/${projectId}/service/${serviceId}/credential/${credId}/view`);
      
    } catch (err) {
      console.error('Failed to update credential:', err);
      setError('Failed to update credential. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/project/${projectId}/service/${serviceId}/credential/${credId}/view`);
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

  if (error && !credential) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential`)}
          >
            Back to Credentials
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
          Edit Credential
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={3}>
            <TextField
              label="Credential Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="outlined"
              helperText="e.g., Email, Admin Account, API Key, etc."
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              multiline={isLong}
              rows={isLong ? 4 : 1}
              helperText="The password or value for this credential"
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