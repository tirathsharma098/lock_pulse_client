'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  Snackbar,
  Alert,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { debounce } from 'lodash';
import { 
  getSharedUsers, 
  shareProject, 
  unshareProject, 
  searchUsers 
} from '@/services/collaborationService';
import { useVault } from '@/contexts/VaultContext';
import { getProject, Project } from '@/services/projectService';
import { decryptCompat } from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Input, Textarea, IconButton as CustomIconButton } from '@/components/ui';
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';

interface SharedUser {
  sr: number;
  id: string;
  username: string;
  email: string;
  sharedAt: string;
}

interface UserOption {
  id: string;
  username: string;
  email: string;
}

export default function ProjectViewPage() {
  const params = useParams();
  const router = useRouter();
  const { vaultKey, setIsCollaborating } = useVault();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    setIsCollaborating(false);
  }, [setIsCollaborating]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
        
        if (data && vaultKey) {
          await decryptProjectPassword(data);
        }
      } catch (err) {
        // console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, vaultKey]);

  const decryptProjectPassword = async (projectData: Project) => {
    if (!vaultKey) {
      setPasswordError('Vault key not available');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError(null);
      
      const password = await decryptCompat(
        projectData.passwordNonce,
        projectData.passwordCiphertext,
        vaultKey
      );
      
      setDecryptedPassword(password);
    } catch (err) {
      // console.error('Failed to decrypt project password:', err);
      setPasswordError('Failed to decrypt project password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCopyPassword = async () => {
    if (decryptedPassword) {
      try {
        await navigator.clipboard.writeText(decryptedPassword);
        toast.success('Password copied to clipboard');
      } catch (err) {
        // console.error('Failed to copy password:', err);
        toast.error('Failed to copy password');
      }
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(async (query: string) => {
      try {
        setIsUserLoading(true);
        const users = await getSharedUsers(projectId, query);
        setSharedUsers(users);
      } catch (error) {
        // console.error('Failed to fetch shared users:', error);
        setSnackbar({ open: true, message: 'Failed to fetch shared users', severity: 'error' });
      } finally {
        setIsUserLoading(false);
      }
    }, 500),
    [projectId]
  );

  const debouncedUserSearch = useMemo(
    () => debounce(async (query: string) => {
      if (query.length < 2) {
        setUserOptions([]);
        return;
      }
      try {
        const users = await searchUsers(query);
        setUserOptions(users);
      } catch {
        // console.error('Failed to search users:', error);
        // toast.error('Failed to search users');
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleShare = async (userId: string) => {
    try {
      await shareProject({ projectId, collaboratorId: userId });
      setSnackbar({ open: true, message: 'Project shared successfully', severity: 'success' });
      debouncedSearch(searchQuery);
    } catch (error) {
      // console.error('Failed to share project:', error);
      setSnackbar({ open: true, message: 'Failed to share project', severity: 'error' });
    }
  };

  const handleUnshare = async (userId: string) => {
    try {
      await unshareProject({ projectId, collaboratorId: userId });
      setSnackbar({ open: true, message: 'Project unshared successfully', severity: 'success' });
      debouncedSearch(searchQuery);
    } catch (error) {
      // console.error('Failed to unshare project:', error);
      setSnackbar({ open: true, message: 'Failed to unshare project', severity: 'error' });
    }
  };

  const handleShareDialogSubmit = async () => {
    if (!selectedUser) return;
    
    await handleShare(selectedUser.id);
    setShareDialogOpen(false);
    setSelectedUser(null);
  };

  const columns: GridColDef[] = [
    { field: 'sr', headerName: 'Sr', minWidth: 10 },
    { field: 'username', headerName: 'Username', minWidth: 100 },
    { field: 'email', headerName: 'Email', minWidth: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 50,
      getActions: (params:any) => [
        <GridActionsCellItem
          key="unshare"
          icon={<PersonRemoveIcon />}
          label="Unshare"
          onClick={() => handleUnshare(params.row.id)}
          // color="error"
          title='Unshare Project'
        />
      ],
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={() => router.back(/*'/project'*/)}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Projects</span>
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Project not found</p>
        </div>
        <Button 
          onClick={() => router.back(/*'/project'*/)}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Projects</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto !p-0 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            // variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        </div>
        <Button 
          // variant="outline"
          onClick={() => router.replace(`/project/${projectId}/edit`)}
          className="flex items-center space-x-2"
        >
          <EditIcon className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-gray-900">{new Date(project.createdAt).toLocaleString()}</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    {passwordLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600">Decrypting...</span>
                      </div>
                    ) : passwordError ? (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-800 text-sm">{passwordError}</p>
                      </div>
                    ) : (
                      project.isLong ? (
                        <Textarea
                          label={`Project Password${project.isLong ? ' (Long Password)' : ''}`}
                          value={showPassword ? decryptedPassword : '••••••••••••'}
                          rows={4}
                          readOnly
                          autoComplete="off"
                        />
                      ) : (
                        <Input
                          label={`Project Password${project.isLong ? ' (Long Password)' : ''}`}
                          type={showPassword ? 'text' : 'password'}
                          value={showPassword ? decryptedPassword : '••••••••••••'}
                          readOnly
                          autoComplete="off"
                        />
                      )
                    )}
                  </div>
                  {!passwordLoading && !passwordError && (
                    <>
                      <CustomIconButton
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        className="mb-1"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </CustomIconButton>
                      <CustomIconButton
                        onClick={handleCopyPassword}
                        variant="ghost"
                        className="mb-1"
                        title="Copy password"
                        disabled={!decryptedPassword}
                      >
                        <ContentCopyIcon />
                      </CustomIconButton>
                    </>
                  )}
                </div>
              </div>
              </form>
              
              {project.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{project.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No services added to this project yet</p>
              <Button 
                // variant="primary"
                onClick={() => router.push(`/project/${projectId}/service`)}
              >
                Manage Services
              </Button>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Project Sharing</CardTitle>
          </CardHeader>
          <CardContent className='!px-0 md:px-6'>
            <Box sx={{ p: {xs: 0, md: 3},  }}>
              <Paper sx={{ p: {xs:1, md: 3}, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Shared Users</Typography>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => setShareDialogOpen(true)}
                  >
                    Share Project
                  </Button>
                </Box>

                <TextField
                  fullWidth
                  label="Search shared users"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <DataGrid
                  rows={sharedUsers}
                  columns={columns}
                  loading={isUserLoading}
                  pageSizeOptions={[10]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                  }}
                  disableRowSelectionOnClick
                  sx={{ height: 400 }}
                />
              </Paper>

              <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Share Project</DialogTitle>
                <DialogContent>
                  <Autocomplete
                    options={userOptions}
                    getOptionLabel={(option) => `${option.username} (${option.email})`}
                    value={selectedUser}
                    onChange={(_, newValue) => setSelectedUser(newValue)}
                    onInputChange={(_, newInputValue) => debouncedUserSearch(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search users"
                        placeholder="Type username or email..."
                        fullWidth
                        margin="normal"
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body1">{option.username}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {option.email}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                  <Button 
                    onClick={handleShareDialogSubmit} 
                    variant="contained"
                    disabled={!selectedUser}
                  >
                    Share
                  </Button>
                </DialogActions>
              </Dialog>

              <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
              >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                  {snackbar.message}
                </Alert>
              </Snackbar>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}