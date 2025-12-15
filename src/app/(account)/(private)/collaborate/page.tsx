'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import { getCollaboratorsForUser } from '@/services/collaborationService';

interface Collaborator {
  id: string;
  username: string;
  email: string;
}

export default function CollaboratePage() {
  const router = useRouter();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await getCollaboratorsForUser();
        setCollaborators(data);
      } catch (error) {
        console.error('Failed to fetch collaborators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  const handleCollaboratorClick = (collaboratorId: string) => {
    router.push(`/collaborate/${collaboratorId}/shared`);
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading collaborators...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Collaborator
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Users who have shared projects with you
      </Typography>

      {collaborators.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No collaborators found. No one has shared projects with you yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {collaborators.map((collaborator) => (
            <Grid item xs={12} sm={6} md={4} key={collaborator.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => handleCollaboratorClick(collaborator.id)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {collaborator.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {collaborator.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {collaborator.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label="Has shared projects" 
                    color="primary" 
                    size="small" 
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}