'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
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
import { EditResourceComponent, EditFieldConfig } from '../../components';

export default function ProjectEditPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const { vaultKey } = useVault();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [longMode, setLongMode] = useState(false);
  
  // Form values
  const [values, setValues] = useState({
    name: '',
    password: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalPassword, setOriginalPassword] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProject(projectId);
        setProject(data);
        setValues({
          name: data.name,
          password: '',
          notes: data.notes || ''
        });
        setLongMode(data.isLong || false);
        
        // Decrypt the original password
        if (data && vaultKey) {
          const decryptedPassword = await decryptCompat(
            data.passwordNonce,
            data.passwordCiphertext,
            vaultKey
          );
          setOriginalPassword(decryptedPassword);
          setValues(prev => ({ ...prev, password: decryptedPassword }));
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

  const fields: EditFieldConfig[] = [
    {
      name: 'name',
      label: 'Project Name',
      type: 'text',
      required: true
    },
    {
      name: 'password',
      label: 'Project Password',
      type: 'password',
      required: true,
      showToggleVisibility: true,
      helperText: 'Change this password to update project encryption'
    },
    {
      name: 'notes',
      label: 'Notes (Optional)',
      type: 'textarea',
      multiline: true,
      rows: 4
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
    if (!values.name.trim()) newErrors.name = 'Project name is required';
    if (!values.password.trim()) newErrors.password = 'Project password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      const newPasswordEncrypted = await encryptField(values.password, vaultKey);
      
      // Generate new salt and wrap vault key with new password
      const newVaultKdfSalt = await generateSalt();
      const newKdfParams = await getDefaultKdfParams();
      const newKek = await deriveKEK(values.password, newVaultKdfSalt, newKdfParams);
      const { nonce: newNonce, ciphertext: newCiphertext } = await wrapVaultKey(projectVaultKey, newKek);
      const newWrappedVaultKey = await combineNonceAndCiphertext(newNonce, newCiphertext);
      
      const updateData = {
        name: values.name.trim(),
        notes: values.notes.trim() || undefined,
        wrappedVaultKey: newWrappedVaultKey,
        vaultKdfSalt: Buffer.from(newVaultKdfSalt).toString('base64'),
        vaultKdfParams: newKdfParams,
        passwordNonce: newPasswordEncrypted.nonce,
        passwordCiphertext: newPasswordEncrypted.ciphertext,
        isLong: longMode,
      };
      
      await updateProject(projectId, updateData);
      
      toast.success('Project updated successfully');
      router.push(`/project/${projectId}/view`);
      
    } catch (err) {
      console.error('Failed to update project:', err);
      setError('Failed to update project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push(`/project/${projectId}/view`);
  };

  return (
    <EditResourceComponent
      title="Edit Project"
      fields={fields}
      values={values}
      errors={errors}
      loading={loading}
      saving={saving}
      showLongMode={true}
      longMode={longMode}
      onValueChange={handleValueChange}
      onLongModeChange={handleLongModeChange}
      onSubmit={handleSubmit}
      onBack={handleBack}
      submitButtonText="Save Changes"
      longModeLabel="Long Password"
      error={error}
    />
  );
}