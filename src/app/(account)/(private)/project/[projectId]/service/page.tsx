'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Button, Container, Typography, List, ListItem, 
  ListItemText, IconButton, Menu, MenuItem, Paper, Divider, ListItemIcon 
} from '@mui/material';
import { useParams } from "next/navigation";
import { MoreVert as MoreVertIcon, Add as AddIcon, ArrowBack as ArrowBackIcon, Password as PasswordIcon, Description as PageIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllServices, Service, deleteService, getService } from '@/services/serviceService';
import { getProject, Project } from '@/services/projectService';
import CreateServiceDialog from '@/components/services/CreateServiceDialog';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { decryptCompat, getVaultKey, initSodium } from '@/lib/crypto';

export default function ServicesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { projectVaultKey, setServiceVaultKey } = useVault();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectData, servicesData] = await Promise.all([
        getProject(projectId),
        getAllServices(projectId)
      ]);
      setProject(projectData);
      setServices(servicesData);
      setError(null);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, service: Service) => {
    setAnchorEl(event.currentTarget);
    setSelectedService(service);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedService(null);
  };

  const handleViewService = () => {
    if (selectedService) {
      router.push(`/project/${projectId}/service/${selectedService.id}/view`);
    }
    handleMenuClose();
  };

  const handleEditService = () => {
    if (selectedService) {
      router.push(`/project/${projectId}/service/${selectedService.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteService = async () => {
    if (selectedService) {
      try {
        await deleteService(projectId, selectedService.id);
        toast.success('Service deleted successfully');
        fetchData();
      } catch (err) {
        setError('Failed to delete service');
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

  const handleServiceCreated = () => {
    fetchData();
    handleCreateDialogClose();
  };

  const handleCredentialRoute = async (service:any) => {
    if (!service || !projectVaultKey){
      toast.error('Vault key not exist.');
      return;
    }
    console.log(">>>>>> service got :: ", service);
      try {
        const gotCurrService = await getService(projectId, service.id);
        // Decrypt service password
        const servicePassword = await decryptCompat(
          gotCurrService.passwordNonce,
          gotCurrService.passwordCiphertext,
          projectVaultKey,
        );
        
        // Unwrap service vault key
        await initSodium();
        const serviceVaultKey = await getVaultKey(
          servicePassword,
          gotCurrService.vaultKdfSalt,
          service.vaultKdfParams,
          gotCurrService.wrappedVaultKey,
        );
        
        // Store service vault key in context
        setServiceVaultKey(serviceVaultKey);
        
        // Navigate to credentials page
        router.push(`/project/${projectId}/service/${service.id}/credential`);
      } catch (err) {
        console.error('Failed to unlock service:', err);
        setError('Failed to unlock service');
      }
    handleMenuClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => router.push('/project')}
          sx={{ mr: 2 }}
        >
          Back to Projects
        </Button>
        <Box flexGrow={1}>
          <Typography variant="h4" component="h1">
            {project?.name || 'Project'} Services
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Service
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading services...</Typography>
      ) : services.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No services created yet. Create your first service to get started.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List>
            {services.map((service, index) => (
              <Box key={service.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, service)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {service.isLong ? <PageIcon /> : <PasswordIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={service.name}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {service.notes || 'No description'}
                        </Typography>
                        {service.isLong && (
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                            Long Password
                          </Typography>
                        )}
                      </Box>
                    }
                    onClick={()=> handleCredentialRoute(service)}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover .MuiListItemText-primary': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
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
        <MenuItem onClick={handleViewService}>
          <ViewIcon sx={{ mr: 1, color: 'action.active' }} />
          View
        </MenuItem>
        <MenuItem onClick={handleEditService}>
          <EditIcon sx={{ mr: 1, color: 'action.active' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteService}>
          <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
          Delete
        </MenuItem>
      </Menu>

      <CreateServiceDialog 
        open={openCreateDialog}
        onClose={handleCreateDialogClose}
        onServiceCreated={handleServiceCreated}
        projectId={projectId}
      />
    </Container>
  );
}