'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { Paper, Typography, Divider, Box, Button } from '@mui/material';
import { useVault } from '@/contexts/VaultContext';
import { getProject, Project } from '@/services/projectService';
import { decryptCompat } from '@/lib/crypto';
import { ViewResourceComponent, ViewFieldConfig } from '../../components';

export default function ProjectViewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { vaultKey } = useVault();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
        
        // Decrypt the project password
        if (data && vaultKey) {
          await decryptProjectPassword(data);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, vaultKey]);

  const decryptProjectPassword = async (projectData: Project) => {
    if (!vaultKey) {
      setError('Vault key not available');
      return;
    }

    try {
      const password = await decryptCompat(
        projectData.passwordNonce,
        projectData.passwordCiphertext,
        vaultKey
      );
      
      setDecryptedPassword(password);
    } catch (err) {
      console.error('Failed to decrypt project password:', err);
      setError('Failed to decrypt project password');
    }
  };

  const handleBack = () => {
    router.push('/project');
  };

  const handleEdit = () => {
    router.push(`/project/${projectId}/edit`);
  };

  const fields: ViewFieldConfig[] = [
    {
      name: 'createdAt',
      label: 'Created',
      type: 'datetime',
      format: (value) => new Date(value).toLocaleString()
    },
    {
      name: 'password',
      label: `Project Password${project?.isLong ? ' (Long Password)' : ''}`,
      type: 'password',
      multiline: project?.isLong,
      rows: project?.isLong ? 4 : 1,
      showToggleVisibility: true,
      copyable: true
    },
    ...(project?.notes ? [{
      name: 'notes',
      label: 'Notes',
      type: 'textarea' as const,
      multiline: true,
      rows: 4
    }] : [])
  ];

  const viewData = project ? {
    ...project,
    password: decryptedPassword
  } : {};

  return (
    <ViewResourceComponent
      title={project?.name || 'Project'}
      fields={fields}
      data={viewData}
      loading={loading}
      error={error}
      onBack={handleBack}
      onEdit={handleEdit}
    >
      {project && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Services
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box textAlign="center" py={2}>
            <Typography color="text.secondary" mb={2}>
              No services added to this project yet
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => router.push(`/project/${projectId}/service`)}
            >
              Manage Services
            </Button>
          </Box>
        </Paper>
      )}
    </ViewResourceComponent>
  );
}