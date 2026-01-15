'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useVault } from '@/contexts/VaultContext';
import { getSharedProjects, getProjectDetails } from '@/services/collaborationService';
import { getVaultKey, VaultKdfParams } from '@/lib/crypto';

interface SharedProject {
  id: string;
  title: string;
  summary: string;
  vaultKdfSalt: string;
  vaultKdfParams: VaultKdfParams;
  wrappedVaultKey: string;
  sharedAt: string;
}

export default function CollaboratorProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const { setCollaboratorId, setIsCollaborating, setProjectVaultKey } = useVault();
  const userId:string = params.userId as string;

  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordDialog, setPasswordDialog] = useState<{
    open: boolean;
    project: SharedProject | null;
  }>({ open: false, project: null });
  const [password, setPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getSharedProjects(userId);
        setProjects(data);
      } catch (error) {
        // console.error('Failed to fetch shared projects');
        setSnackbar({ 
          open: true, 
          message: 'Failed to fetch shared projects', 
          severity: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleProjectClick = (project: SharedProject) => {
    setPasswordDialog({ open: true, project });
    setPassword('');
  };

  const handleUnlockProject = async () => {
    if (!passwordDialog.project || !password) return;

    setUnlocking(true);
    try {
      const projectId = passwordDialog.project.id;

      // Fetch full project details
      const projectDetails = await getProjectDetails(projectId);

      // Use the existing getVaultKey function to unwrap the vault key
      const vaultKey = await getVaultKey(
        password,
        projectDetails.vaultKdfSalt,
        projectDetails.vaultKdfParams,
        projectDetails.wrappedVaultKey
      );

      // Set collaboration context
      setProjectVaultKey(vaultKey);
      setIsCollaborating(true);
      setCollaboratorId(userId as string);
      // Navigate to project services
      router.push(`/project/${projectId}/service`);
      
      setPasswordDialog({ open: false, project: null });
      setPassword('');
    } catch (error) {
      // console.error('Failed to unlock project');
      setSnackbar({ 
        open: true, 
        message: 'Invalid password or failed to unlock project', 
        severity: 'error' 
      });
    } finally {
      setUnlocking(false);
    }
  };

  const handleDialogClose = () => {
    setPasswordDialog({ open: false, project: null });
    setPassword('');
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading shared projects...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Shared Projects
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Projects shared with you by this collaborator
      </Typography>

      {projects.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No projects shared with you by this user.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleProjectClick(project)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" noWrap>
                      {project.title}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {project.summary || 'No description'}
                  </Typography>
                  
                  <Chip 
                    label={`Shared ${new Date(project.sharedAt).toLocaleDateString()}`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Password Dialog */}
      <Dialog 
        open={passwordDialog.open} 
        onClose={handleDialogClose}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Unlock Project: {passwordDialog.project?.title}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the project password to access its contents.
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Project Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && password) {
                handleUnlockProject();
              }
            }}
            disabled={unlocking}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={unlocking}>
            Cancel
          </Button>
          <Button 
            onClick={handleUnlockProject}
            variant="contained"
            disabled={!password || unlocking}
          >
            {unlocking ? 'Unlocking...' : 'Unlock'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}