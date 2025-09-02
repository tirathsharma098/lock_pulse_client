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
import { getService, Service } from '@/services/serviceService';
import { decryptCompat } from '@/lib/crypto';

export default function ServiceViewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const router = useRouter();
  const { projectVaultKey } = useVault();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getService(projectId, serviceId);
        setService(data);
        console.log(">>> Fetched service data: ",projectVaultKey);
        // Decrypt the service password
        if (data && projectVaultKey) {
          console.log(">>> Decrypting service password...");
          await decryptServicePassword(data);
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

  const decryptServicePassword = async (serviceData: Service) => {
    if (!projectVaultKey) {
      setPasswordError('Project vault key not available');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      
      const password = await decryptCompat(
        serviceData.passwordNonce,
        serviceData.passwordCiphertext,
        projectVaultKey
      );
      console.log(">> Decrypted password: ", password);
      setDecryptedPassword(password);
    } catch (err) {
      console.error('Failed to decrypt service password:', err);
      setPasswordError('Failed to decrypt service password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
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
    router.push(`/project/${projectId}/service`);
  };

  const handleEdit = () => {
    router.push(`/project/${projectId}/service/${serviceId}/edit`);
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
            Back to Services
          </Button>
        </Box>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Service not found</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleBack}
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
          {service.name}
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
          Service Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Created
          </Typography>
          <Typography>
            {new Date(service.createdAt).toLocaleString()}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Service Password
            {service.isLong && (
              <Typography component="span" variant="caption" color="primary" sx={{ ml: 1, fontWeight: 'bold' }}>
                (Long Password)
              </Typography>
            )}
          </Typography>
          {passwordLoading ? (
            <Box display="flex" alignItems="center">
              <CircularProgress size={20} sx={{ mr: 1 }} />
              <Typography variant="body2">Decrypting...</Typography>
            </Box>
          ) : passwordError ? (
            <Alert severity="error" sx={{ mt: 1 }}>
              {passwordError}
            </Alert>
          ) : (
            service.isLong ? (
              <TextField
                value={showPassword ? decryptedPassword : '••••••••••••'}
                variant="outlined"
                size="small"
                fullWidth
                multiline
                rows={4}
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
            ) : (
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
            )
          )}
        </Box>
        
        {service.notes && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Notes
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {service.notes}
            </Typography>
          </Box>
        )}
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Credentials
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Box textAlign="center" py={2}>
          <Typography color="text.secondary" mb={2}>
            No credentials added to this service yet
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential`)}
          >
            Manage Credentials
          </Button>
        </Box>
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