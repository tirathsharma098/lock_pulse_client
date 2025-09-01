'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Button, Container, Typography, List, ListItem, 
  ListItemText, IconButton, Menu, MenuItem, Paper, Divider 
} from '@mui/material';
import { MoreVert as MoreVertIcon, Add as AddIcon } from '@mui/icons-material';
import { getAllProjects, Project, deleteProject } from '@/services/projectService';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import { toast } from 'sonner';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleViewProject = () => {
    if (selectedProject) {
      router.push(`/project/${selectedProject.id}/view`);
    }
    handleMenuClose();
  };

  const handleEditProject = () => {
    if (selectedProject) {
      router.push(`/project/${selectedProject.id}/edit`);
    }
    handleMenuClose();
  };

  const handleDeleteProject = async () => {
    if (selectedProject) {
      try {
        await deleteProject(selectedProject.id);
        toast.success('Project deleted successfully');
        fetchProjects();
      } catch (err) {
        setError('Failed to delete project');
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

  const handleProjectCreated = () => {
    fetchProjects();
    handleCreateDialogClose();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Projects
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Project
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>Loading projects...</Typography>
      ) : projects.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            You don't have any projects yet. Create your first project to get started.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={2}>
          <List>
            {projects.map((project, index) => (
              <Box key={project.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      onClick={(e) => handleMenuOpen(e, project)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={project.name}
                    secondary={project.notes || 'No description'}
                    onClick={() => router.push(`/project/${project.id}/view`)}
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
        <MenuItem onClick={handleViewProject}>View</MenuItem>
        <MenuItem onClick={handleEditProject}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteProject}>Delete</MenuItem>
      </Menu>

      <CreateProjectDialog 
        open={openCreateDialog}
        onClose={handleCreateDialogClose}
        onProjectCreated={handleProjectCreated}
      />
    </Container>
  );
}