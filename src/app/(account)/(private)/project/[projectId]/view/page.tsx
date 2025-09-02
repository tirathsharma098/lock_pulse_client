'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { 
  ArrowBack as ArrowBackIcon, 
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon
} from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { getProject, Project } from '@/services/projectService';
import { decryptCompat } from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Button, Input, Textarea, IconButton } from '@/components/ui';

export default function ProjectViewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { vaultKey } = useVault();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

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
      console.error('Failed to decrypt project password:', err);
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
        console.error('Failed to copy password:', err);
        toast.error('Failed to copy password');
      }
    }
  };

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
          onClick={() => router.push('/project')}
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
          onClick={() => router.push('/project')}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Projects</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            onClick={() => router.push('/project')}
            className="flex items-center space-x-2"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.push(`/project/${projectId}/edit`)}
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
                        />
                      ) : (
                        <Input
                          label={`Project Password${project.isLong ? ' (Long Password)' : ''}`}
                          type={showPassword ? 'text' : 'password'}
                          value={showPassword ? decryptedPassword : '••••••••••••'}
                          readOnly
                        />
                      )
                    )}
                  </div>
                  {!passwordLoading && !passwordError && (
                    <>
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        className="mb-1"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                      <IconButton
                        onClick={handleCopyPassword}
                        variant="ghost"
                        className="mb-1"
                        title="Copy password"
                        disabled={!decryptedPassword}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
              
              {project.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">{project.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No services added to this project yet</p>
              <Button 
                variant="primary"
                onClick={() => router.push(`/project/${projectId}/service`)}
              >
                Manage Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}