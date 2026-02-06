'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { 
  ArrowBack as ArrowBackIcon, 
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { getProject, updateProject, Project } from '@/services/projectService';
import { 
  decryptCompat, 
  encryptField, 
  unwrapVaultKey, 
  wrapVaultKey, 
  generateSalt, 
  getDefaultKdfParams, 
  deriveKEK, 
  combineNonceAndCiphertext,
} from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Button, Input, Textarea, Switch, IconButton, PasswordGenerator } from '@/components/ui';

export default function ProjectEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { vaultKey } = useVault();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLong, setIsLong] = useState(false);
  
  // Form fields
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [originalPassword, setOriginalPassword] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
        setName(data.name);
        setNotes(data.notes || '');
        setIsLong(data.isLong || false);
        
        // Decrypt the original password
        if (data && vaultKey) {
          const decryptedPassword = await decryptCompat(
            data.passwordNonce,
            data.passwordCiphertext,
            vaultKey
          );
          setOriginalPassword(decryptedPassword);
          setPassword(decryptedPassword);
        }
      } catch (err) {
        // console.error('Error fetching project',);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, vaultKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Project password is required');
      return;
    }
    
    if (!project || !vaultKey) {
      setError('Project data or vault key not available');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Unwrap the current vault key using the original password
      const originalKdfSalt = new Uint8Array(Buffer.from(project.vaultKdfSalt, 'base64'));
      const originalKek = await deriveKEK(originalPassword, originalKdfSalt, project.vaultKdfParams);
      const projectVaultKey = await unwrapVaultKey(project.wrappedVaultKey, originalKek);
      
      // Encrypt the new password with user's vault key
      const newPasswordEncrypted = await encryptField(password, vaultKey);
      
      // Generate new salt and wrap vault key with new password
      const newVaultKdfSalt = await generateSalt();
      const newKdfParams = await getDefaultKdfParams();
      const newKek = await deriveKEK(password, newVaultKdfSalt, newKdfParams);
      const { nonce: newNonce, ciphertext: newCiphertext } = await wrapVaultKey(projectVaultKey, newKek);
      const newWrappedVaultKey = await combineNonceAndCiphertext(newNonce, newCiphertext);
      
      const updateData = {
        name: name.trim(),
        notes: notes.trim() || undefined,
        wrappedVaultKey: newWrappedVaultKey,
        vaultKdfSalt: Buffer.from(newVaultKdfSalt).toString('base64'),
        vaultKdfParams: newKdfParams,
        passwordNonce: newPasswordEncrypted.nonce,
        passwordCiphertext: newPasswordEncrypted.ciphertext,
        isLong,
      };
      
      await updateProject(projectId, updateData);
      
      toast.success('Project updated successfully');
      router.replace(`/project/${projectId}/view`);
      
    } catch (err:any) {
      // console.error('Failed to update project');
      setError(err?.message || 'Failed to update project. Please try again.');
    } finally {
      setSaving(false);
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

  if (error && !project) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={() => router.back()}
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
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="project-edit-form" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
                autoComplete="off"
              />
              
              <div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1">
                    {isLong ? (
                      <Textarea
                        label="Project Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter project password"
                        required
                        rows={4}
                        helperText="Change this password to update project encryption"
                        autoComplete="off"
                      />
                    ) : (
                      <Input
                        label="Project Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter project password"
                        required
                        helperText="Change this password to update project encryption"
                        autoComplete="off"
                      />
                    )}
                  </div>
                  {!isLong && <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    className="mt-1"
                    type='button'
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>}
                </div>
              </div>

              <Switch
                checked={isLong}
                onCheckedChange={setIsLong}
                label="Long Password"
              />
              
              <Textarea
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this project"
                rows={4}
                autoComplete="off"
              />
            </div>
          </form>
          <div className="mt-4">
            <PasswordGenerator />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.replace(`/project/${projectId}/view`)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="project-edit-form"
              variant="primary"
              disabled={saving}
              loading={saving}
              className="flex items-center space-x-2"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Save Changes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}