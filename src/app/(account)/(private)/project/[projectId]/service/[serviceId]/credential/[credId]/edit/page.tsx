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
import { getCredential, updateCredential, Credential } from '@/services/credentialService';
import { decryptCompat, encryptField } from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Button, Input, Textarea, Switch, IconButton } from '@/components/ui';

export default function CredentialEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const credId = params.credId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLong, setIsLong] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const data = await getCredential(projectId, serviceId, credId);
        setCredential(data);
        setIsLong(data.isLong || false);
        
        // Decrypt the credential data
        if (data && serviceVaultKey) {
          const [decryptedTitle, decryptedPassword] = await Promise.all([
            decryptCompat(data.titleNonce, data.titleCiphertext, serviceVaultKey),
            decryptCompat(data.passwordNonce, data.passwordCiphertext, serviceVaultKey)
          ]);
          
          setTitle(decryptedTitle);
          setPassword(decryptedPassword);
        }
      } catch (err) {
        // console.error('Error fetching credential:', err);
        setError('Failed to load credential details');
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [projectId, serviceId, credId, serviceVaultKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    if (!serviceVaultKey) {
      setError('Service vault key not available');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Encrypt title and password with service vault key
      const titleEncrypted = await encryptField(title.trim(), serviceVaultKey);
      const passwordEncrypted = await encryptField(password, serviceVaultKey);
      
      await updateCredential(projectId, serviceId, credId, {
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong,
      });
      
      toast.success('Credential updated successfully');
      router.replace(`/project/${projectId}/service/${serviceId}/credential/${credId}/view`);
      
    } catch (err) {
      // console.error('Failed to update credential:', err);
      setError('Failed to update credential. Please try again.');
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

  if (error && !credential) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={() => router.back(/*`/project/${projectId}/service/${serviceId}/credential`*/)}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Credentials</span>
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
            onClick={() => router.back(/*`/project/${projectId}/service/${serviceId}/credential`*/)}
            className="flex items-center space-x-2"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Credential</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credential Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                label="Credential Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Email, Admin Account, API Key, etc."
                required
                helperText="e.g., Email, Admin Account, API Key, etc."
                autoComplete="off"
              />
              
              <div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    {isLong ? (
                      <Textarea
                        label="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="The password or value for this credential"
                        required
                        rows={4}
                        helperText="The password or value for this credential"
                        autoComplete="off"
                      />
                    ) : (
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="The password or value for this credential"
                        required
                        // helperText="The password or value for this credential"
                        autoComplete="off"
                      />
                    )}
                  </div>
                  {!isLong && <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    type='button'
                    // className="mb-1"
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
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  type='button'
                  onClick={() => router.replace(`/project/${projectId}/service/${serviceId}/credential/${credId}/view`)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={saving}
                  loading={saving}
                  className="flex items-center space-x-2"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>Save Changes</span>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}