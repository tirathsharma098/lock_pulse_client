'use client';

import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Button,
  Divider
} from '@mui/material';
import { useVault } from '@/contexts/VaultContext';
import { Toaster } from 'sonner';
import ProfileHeader from './components/ProfileHeader';
import UpdatePasswordDialog from './components/UpdatePasswordDialog';

export default function ProfilePage() {
  const { username } = useVault();
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);

  const handleUpdatePassword = () => {
    setIsUpdatePasswordOpen(true);
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Toaster position="top-center" duration={1500} richColors />
      
      <Paper elevation={3} className="p-8">
        <ProfileHeader username={username || 'Unknown User'} />
        
        <Divider className="my-6" />
        
        <Box className="space-y-4">
          <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
            Security Settings
          </Typography>
          
          <Box className="p-4 border border-gray-200 rounded-lg">
            <Typography variant="subtitle1" className="font-medium mb-2">
              Master Password
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-3">
              Your master password is used to encrypt and decrypt your vault. 
              Updating it will re-encrypt your vault with the new password.
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleUpdatePassword}
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              Update Master Password
            </Button>
          </Box>
        </Box>
      </Paper>

      <UpdatePasswordDialog
        open={isUpdatePasswordOpen}
        onClose={() => setIsUpdatePasswordOpen(false)}
        username={username || ''}
      />
    </Container>
  );
}
