'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Container, Typography, Paper, Box, Button, 
  TextField, Alert, CircularProgress, IconButton, InputAdornment
} from '@mui/material';
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
        console.error('Error fetching project:', err);
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
      
      // Check if password has changed
      const passwordChanged = password !== originalPassword;
      
      let updateData: any = {
        name: name.trim(),
        notes: notes.trim() || undefined
      };
      
      // If password changed, we need to re-encrypt everything
      if (passwordChanged) {
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
        
        updateData = {
          ...updateData,
          wrappedVaultKey: newWrappedVaultKey,
          vaultKdfSalt: Buffer.from(newVaultKdfSalt).toString('base64'),
          vaultKdfParams: newKdfParams,
          passwordNonce: newPasswordEncrypted.nonce,
          passwordCiphertext: newPasswordEncrypted.ciphertext,
        };
      }
      
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

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !project) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={() => router.push('/project')}
          >
            Back to Projects
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Edit Project
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box mb={3}>
            <TextField
              label="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              variant="outlined"
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Project Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              variant="outlined"
              helperText="Change this password to update project encryption"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          
          <Box mb={3}>
            <TextField
              label="Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              fullWidth
              multiline
              rows={4}
              variant="outlined"
            />
          </Box>
          
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={handleBack}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}