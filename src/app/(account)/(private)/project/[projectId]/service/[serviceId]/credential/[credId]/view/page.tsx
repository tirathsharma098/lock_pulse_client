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
import { getCredential, Credential } from '@/services/credentialService';
import { decryptCompat } from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Button, Input, Textarea, IconButton } from '@/components/ui';

export default function CredentialViewPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const credId = params.credId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decryptedTitle, setDecryptedTitle] = useState<string>('');
  const [decryptedPassword, setDecryptedPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [decryptLoading, setDecryptLoading] = useState(false);
  const [decryptError, setDecryptError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const data = await getCredential(projectId, serviceId, credId);
        setCredential(data);
        
        // Decrypt the credential data
        if (data && serviceVaultKey) {
          await decryptCredentialData(data);
        }
      } catch (err) {
        console.error('Error fetching credential:', err);
        setError('Failed to load credential details');
      } finally {
        setLoading(false);
      }
    };

    fetchCredential();
  }, [projectId, serviceId, credId, serviceVaultKey]);

  const decryptCredentialData = async (credentialData: Credential) => {
    if (!serviceVaultKey) {
      setDecryptError('Service vault key not available');
      return;
    }

    try {
      setDecryptLoading(true);
      setDecryptError(null);
      
      const [title, password] = await Promise.all([
        decryptCompat(credentialData.titleNonce, credentialData.titleCiphertext, serviceVaultKey),
        decryptCompat(credentialData.passwordNonce, credentialData.passwordCiphertext, serviceVaultKey)
      ]);
      
      setDecryptedTitle(title);
      setDecryptedPassword(password);
    } catch (err) {
      console.error('Failed to decrypt credential data:', err);
      setDecryptError('Failed to decrypt credential data');
    } finally {
      setDecryptLoading(false);
    }
  };

  const handleCopyTitle = async () => {
    if (decryptedTitle) {
      try {
        await navigator.clipboard.writeText(decryptedTitle);
        toast.success('Title copied to clipboard');
      } catch (err) {
        console.error('Failed to copy title:', err);
        toast.error('Failed to copy title');
      }
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
          onClick={() => router.back(/*`/project/${projectId}/service/${serviceId}/credential`*/)}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Credentials</span>
        </Button>
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">Credential not found</p>
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
          <h1 className="text-2xl font-bold text-gray-900">
            {decryptedTitle || 'Credential'}
          </h1>
        </div>
        <Button 
          variant="outline"
          onClick={() => router.replace(`/project/${projectId}/service/${serviceId}/credential/${credId}/edit`)}
          className="flex items-center space-x-2"
        >
          <EditIcon className="w-4 h-4" />
          <span>Edit</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credential Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-gray-900">{new Date(credential.createdAt).toLocaleString()}</p>
            </div>

            {decryptLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm text-gray-600">Decrypting credential data...</span>
              </div>
            ) : decryptError ? (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{decryptError}</p>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <Input
                        label="Title"
                        value={decryptedTitle}
                        readOnly
                      />
                    </div>
                    <IconButton
                      onClick={handleCopyTitle}
                      variant="ghost"
                      className="mb-1"
                      title="Copy title"
                      disabled={!decryptedTitle}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </div>
                </div>

                <div>
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      {credential.isLong ? (
                        <Textarea
                          label={`Password${credential.isLong ? ' (Long Password)' : ''}`}
                          value={showPassword ? decryptedPassword : '••••••••••••'}
                          rows={4}
                          readOnly
                        />
                      ) : (
                        <Input
                          label={`Password${credential.isLong ? ' (Long Password)' : ''}`}
                          type={showPassword ? 'text' : 'password'}
                          value={showPassword ? decryptedPassword : '••••••••••••'}
                          readOnly
                        />
                      )}
                    </div>
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      className="mb-1"
                      title={showPassword ? 'Hide password' : 'Show password'}
                      disabled={!decryptedPassword}
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
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}