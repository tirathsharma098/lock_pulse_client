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
import { getService, updateService, Service } from '@/services/serviceService';
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
import { Card, CardHeader, CardContent, CardTitle, Button, Input, Textarea, Switch, IconButton } from '@/components/ui';

export default function ServiceEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const router = useRouter();
  const { projectVaultKey } = useVault();
  const [service, setService] = useState<Service | null>(null);
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
    const fetchService = async () => {
      try {
        const data = await getService(projectId, serviceId);
        setService(data);
        setName(data.name);
        setNotes(data.notes || '');
        setIsLong(data.isLong || false);
        
        // Decrypt the original password
        if (data && projectVaultKey) {
          const decryptedPassword = await decryptCompat(
            data.passwordNonce,
            data.passwordCiphertext,
            projectVaultKey
          );
          setOriginalPassword(decryptedPassword);
          setPassword(decryptedPassword);
        }
      } catch (err: any) {
        // console.error('Error fetching service:', err);
        setError(err?.message ||'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [projectId, serviceId, projectVaultKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(">>> Submitting service update...");
    if (!name.trim()) {
      setError('Service name is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Service password is required');
      return;
    }
    
    if (!service || !projectVaultKey) {
      setError('Service data or project vault key not available');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      let updateData: any = {
        name: name.trim(),
        notes: notes.trim() || undefined,
      };
      
      // We need to re-encrypt everything even if password is not changed, to ensure consistency
        // Unwrap the current service vault key using the original password
        const originalKdfSalt = new Uint8Array(Buffer.from(service.vaultKdfSalt, 'base64'));
        const originalKek = await deriveKEK(originalPassword, originalKdfSalt, service.vaultKdfParams);
        const serviceVaultKey = await unwrapVaultKey(service.wrappedVaultKey, originalKek);
        
        // Encrypt the new password with project's vault key
        const newPasswordEncrypted = await encryptField(password, projectVaultKey);
        
        // Generate new salt and wrap vault key with new password
        const newVaultKdfSalt = await generateSalt();
        const newKdfParams = await getDefaultKdfParams();
        const newKek = await deriveKEK(password, newVaultKdfSalt, newKdfParams);
        const { nonce: newNonce, ciphertext: newCiphertext } = await wrapVaultKey(serviceVaultKey, newKek);
        const newWrappedVaultKey = await combineNonceAndCiphertext(newNonce, newCiphertext);
        
        updateData = {
          ...updateData,
          wrappedVaultKey: newWrappedVaultKey,
          vaultKdfSalt: Buffer.from(newVaultKdfSalt).toString('base64'),
          vaultKdfParams: newKdfParams,
          passwordNonce: newPasswordEncrypted.nonce,
          passwordCiphertext: newPasswordEncrypted.ciphertext,
          isLong,
        };
      await updateService(projectId, serviceId, updateData);
      toast.success('Service updated successfully');
      router.replace(`/project/${projectId}/service/${serviceId}/view`);
    } catch (err: any) {
      // console.error('Failed to update service:', err);
      setError(err?.message || 'Failed to update service. Please try again.');
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

  if (error && !service) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
        <Button 
          onClick={() => router.back(/*`/project/${projectId}/service`*/)}
          className="flex items-center space-x-2"
        >
          <ArrowBackIcon className="w-4 h-4" />
          <span>Back to Services</span>
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
            onClick={() => router.back(/*`/project/${projectId}/service`*/)}
            className="flex items-center space-x-2"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Information</CardTitle>
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
                label="Service Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter service name"
                required
                autoComplete="off"
              />
              
              <div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    {isLong ? (
                      <Textarea
                        label="Service Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter service password"
                        required
                        rows={4}
                        helperText="Change this password to update service encryption"
                        autoComplete="off"
                      />
                    ) : (
                      <Input
                        label="Service Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter service password"
                        required
                        // helperText="Change this password to update service encryption"
                        autoComplete="off"
                      />
                    )}
                  </div>
                  {!isLong && <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    // className="mb-1"
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
                placeholder="Add any notes about this service"
                rows={4}
                autoComplete="off"
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.replace(`/project/${projectId}/service/${serviceId}/view`)}
                  disabled={saving}
                  type='button'
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