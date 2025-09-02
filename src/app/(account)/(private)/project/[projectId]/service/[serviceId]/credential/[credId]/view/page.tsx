'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Paper, Box, Button, 
  Divider, CircularProgress, Alert, IconButton,
  InputAdornment, TextField, Snackbar
} from '@mui/material';
import { useParams } from "next/navigation";
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { getCredential, Credential } from '@/services/credentialService';
import { decryptCompat } from '@/lib/crypto';

export default function CredentialViewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const credId = params.credId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedTitle, setDecryptedTitle] = useState<string>('');
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const data = await getCredential(projectId, serviceId, credId);
        setCredential(data);
        
        // Decrypt the credential data
        if (data && serviceVaultKey) {
          await decryptCredentialData(data);
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

  const decryptCredentialData = async (credentialData: Credential) => {
    if (!serviceVaultKey) {
      setDecryptError('Service vault key not available');
      return;
    }

    try {
      setDecryptLoading(true);
      setDecryptError(null);
      
      const [title, password] = await Promise.all([
        decryptCompat(credentialData.titleNonce, credentialData.titleCiphertext, serviceVaultKey),
        decryptCompat(credentialData.passwordNonce, credentialData.passwordCiphertext, serviceVaultKey)
      ]);
      
      setDecryptedTitle(title);
      setDecryptedPassword(password);
    } catch (err) {
      console.error('Failed to decrypt credential data:', err);
      setDecryptError('Failed to decrypt credential data');
    } finally {
      setDecryptLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyTitle = async () => {
    if (decryptedTitle) {
      try {
        await navigator.clipboard.writeText(decryptedTitle);
        setSnackbarMessage('Title copied to clipboard');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to copy title:', err);
        setSnackbarMessage('Failed to copy title');
        setSnackbarOpen(true);
      }
    }
  };

  const handleCopyPassword = async () => {
    if (decryptedPassword) {
      try {
        await navigator.clipboard.writeText(decryptedPassword);
        setSnackbarMessage('Password copied to clipboard');
        setSnackbarOpen(true);
      } catch (err) {
        console.error('Failed to copy password:', err);
        setSnackbarMessage('Failed to copy password');
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleBack = () => {
    router.push(`/project/${projectId}/service/${serviceId}/credential`);
  };

  const handleEdit = () => {
    router.push(`/project/${projectId}/service/${serviceId}/credential/${credId}/edit`);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
          >
            Back to Credentials
          </Button>
        </Box>
      </Container>
    );
  }

  if (!credential) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Credential not found</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
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
          {decryptedTitle || 'Credential'}
        </Typography>
        <Button 
          variant="outlined" 
          startIcon={<EditIcon />} 
          onClick={handleEdit}
        >
          Edit
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Credential Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Created
          </Typography>
          <Typography>
            {new Date(credential.createdAt).toLocaleString()}
          </Typography>
        </Box>

        {decryptLoading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={4}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">Decrypting credential data...</Typography>
          </Box>
        ) : decryptError ? (
          <Alert severity="error" sx={{ mt: 1 }}>
            {decryptError}
          </Alert>
        ) : (
          <>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Title
              </Typography>
              <TextField
                value={decryptedTitle}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleCopyTitle}
                        edge="end"
                        title="Copy title"
                        disabled={!decryptedTitle}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Password
              </Typography>
              <TextField
                value={showPassword ? decryptedPassword : '••••••••••••'}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        title={showPassword ? 'Hide password' : 'Show password'}
                        disabled={!decryptedPassword}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      <IconButton
                        onClick={handleCopyPassword}
                        edge="end"
                        title="Copy password"
                        disabled={!decryptedPassword}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}