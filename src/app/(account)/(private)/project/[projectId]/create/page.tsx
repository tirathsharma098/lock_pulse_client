'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { createProject } from '@/services/projectService';
import { 
  encryptField, 
  wrapVaultKey, 
  generateVaultKey, 
  generateSalt, 
  getDefaultKdfParams, 
  deriveKEK, 
  combineNonceAndCiphertext 
} from '@/lib/crypto';
import { CreateResourceComponent, CreateFieldConfig } from '../../components';

export default function ProjectCreatePage() {
  const router = useRouter();
  const params = useParams();
  const { vaultKey } = useVault();
  
  const [values, setValues] = useState({
    name: '',
    password: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [longMode, setLongMode] = useState(false);

  const fields: CreateFieldConfig[] = [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      required: true,
      placeholder: 'Enter project name'
    },
    {
      name: 'password',
      label: 'Project Password',
      type: 'password',
      required: true,
      showToggleVisibility: true,
      helperText: 'This password will be used to encrypt project data'
    },
    {
      name: 'notes',
      label: 'Notes (Optional)',
      type: 'textarea',
      multiline: true,
      rows: 3
    }
  ];

  const handleValueChange = (fieldName: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleLongModeChange = (value: boolean) => {
    setLongMode(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    if (!values.name) newErrors.name = 'Project name is required';
    if (!values.password) newErrors.password = 'Project password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (!vaultKey) {
      toast.error('Vault key not available. Please log in again.');
      return;
    }
    
    try {
      setLoading(true);
      setErrors({});
      
      // Generate a new vault key for the project
      const projectVaultKey = await generateVaultKey();
      
      // Encrypt project password with user's vault key
      const passwordEncrypted = await encryptField(values.password, vaultKey);

      const vaultKdfSalt = await generateSalt();
      const defaultKdfParams = await getDefaultKdfParams();
      const kek = await deriveKEK(values.password, vaultKdfSalt, defaultKdfParams);
      const { nonce, ciphertext } = await wrapVaultKey(projectVaultKey, kek);
      // Wrap the project vault key with the project password
      const wrappedVaultKey = await combineNonceAndCiphertext(nonce, ciphertext);
      
      // Create project in the backend
      await createProject({
        name: values.name,
        wrappedVaultKey,
        vaultKdfSalt: Buffer.from(vaultKdfSalt).toString('base64'),
        vaultKdfParams: defaultKdfParams,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong: longMode,
        notes: values.notes || undefined
      });
      
      toast.success('Project created successfully');
      router.push('/project');
      
    } catch (err) {
      console.error('Failed to create project:', err);
      toast.error('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/project');
  };

  return (
    <CreateResourceComponent
      title="Create New Project"
      fields={fields}
      values={values}
      errors={errors}
      loading={loading}
      showLongMode={true}
      longMode={longMode}
      onValueChange={handleValueChange}
      onLongModeChange={handleLongModeChange}
      onSubmit={handleSubmit}
      onBack={handleBack}
      submitButtonText="Create Project"
      longModeLabel="Long Password"
    />
  );
}