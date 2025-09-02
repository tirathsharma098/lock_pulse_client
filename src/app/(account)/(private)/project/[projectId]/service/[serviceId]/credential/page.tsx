'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Button, Container, Typography, List, ListItem, 
  ListItemText, IconButton, Menu, MenuItem, Paper, Divider, ListItemIcon 
} from '@mui/material';
import { useParams } from "next/navigation";
import { MoreVert as MoreVertIcon, Add as AddIcon, ArrowBack as ArrowBackIcon, Password as PasswordIcon, Description as PageIcon } from '@mui/icons-material';
import { getAllCredentials, Credential, deleteCredential } from '@/services/credentialService';
import { getService, Service } from '@/services/serviceService';
import CreateCredentialDialog from '@/components/credentials/CreateCredentialDialog';
import { useVault } from '@/contexts/VaultContext';
import { decryptCompat } from '@/lib/crypto';
import { toast } from 'sonner';

export default function CredentialsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [service, setService] = useState<Service | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [decryptedTitles, setDecryptedTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [serviceData, credentialsData] = await Promise.all([
        getService(projectId, serviceId),
        getAllCredentials(projectId, serviceId)
      ]);
      setService(serviceData);
      setCredentials(credentialsData);
      
      // Decrypt credential titles
      if (serviceVaultKey && credentialsData.length > 0) {
        await decryptCredentialTitles(credentialsData);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const decryptCredentialTitles = async (credentialsData: Credential[]) => {
    if (!serviceVaultKey) return;
    
    const titles: Record<string, string> = {};
    for (const credential of credentialsData) {
      try {
        const decryptedTitle = await decryptCompat(
          credential.titleNonce,
          credential.titleCiphertext,
          serviceVaultKey
        );
        titles[credential.id] = decryptedTitle;
      } catch (err) {
        console.error(`Failed to decrypt title for credential ${credential.id}:`, err);
        titles[credential.id] = 'Unable to decrypt title';
      }
    }
    setDecryptedTitles(titles);
  };

  useEffect(() => {
    fetchData();
  }, [projectId, serviceId, serviceVaultKey]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, credential: Credential) => {
    setAnchorEl(event.currentTarget);
    setSelectedCredential(credential);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCredential(null);
  };

  const handleViewCredential = () => {
    if (selectedCredential) {
      router.push(`/project/${projectId}/service/${serviceId}/credential/${selectedCredential.id}/view`);
    }
    handleMenuClose();
  };

  const handleEditCredential = () => {
    if (selectedCredential) {
      router.push(`/project/${projectId}/service/${serviceId}/credential/${selectedCredential.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteCredential = async () => {
    if (selectedCredential) {
      try {
        await deleteCredential(projectId, serviceId, selectedCredential.id);
        toast.success('Credential deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete credential');
        console.error(err);
      }
    }
    handleMenuClose();
  };

  const handleCreateDialogOpen = () => {
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  const handleCredentialCreated = () => {
    fetchData();
    handleCreateDialogClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push(`/project/${projectId}/service`)}
          sx={{ mr: 2 }}
        >
          Back to Services
        </Button>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1">
            {service?.name || 'Service'} Credentials
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Credential
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading credentials...</Typography>
      ) : credentials.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No credentials created yet. Create your first credential to get started.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List>
            {credentials.map((credential, index) => (
              <Box key={credential.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, credential)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {credential.isLong ? <PageIcon /> : <PasswordIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={decryptedTitles[credential.id] || 'Loading...'}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(credential.createdAt).toLocaleDateString()}
                        </Typography>
                        {credential.isLong && (
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            Long Password
                          </Typography>
                        )}
                      </Box>
                    }
                    onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential/${credential.id}/view`)}
                    sx={{ cursor: 'pointer' }}
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCredential}>View</MenuItem>
        <MenuItem onClick={handleEditCredential}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteCredential}>Delete</MenuItem>
      </Menu>

      <CreateCredentialDialog 
        open={openCreateDialog}
        onClose={handleCreateDialogClose}
        onCredentialCreated={handleCredentialCreated}
        projectId={projectId}
        serviceId={serviceId}
      />
    </Container>
  );
}