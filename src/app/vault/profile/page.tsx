'use client';

import { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box,
  Button,
  Divider,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Edit, Check, Close } from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { toast } from 'sonner';
import ProfileHeader from './components/ProfileHeader';
import UpdatePasswordDialog from './components/UpdatePasswordDialog';

export default function ProfilePage() {
  const { username, email, vaultKey, setVaultData } = useVault();
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  // const [newEmail, setNewEmail] = useState(email); // Static email
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  const handleUpdatePassword = () => {
    setIsUpdatePasswordOpen(true);
  };

  const handleEditEmail = () => {
    setTempEmail(email!);
    setIsEditingEmail(true);
  };

  const handleSaveEmail = () => {
    setVaultData(vaultKey, username || '', tempEmail);
    setIsEditingEmail(false);
    toast.success('Email updated successfully');
  };

  const handleCancelEditEmail = () => {
    setTempEmail('');
    setIsEditingEmail(false);
  };

  return (
    <Container maxWidth="md" className="py-8">      
      <Paper elevation={3} className="p-8">
        <ProfileHeader username={username || 'Unknown User'} />
        
        <Divider className="my-6" />
        
        <Box className="space-y-4 my-4">
          <Typography variant="h6" className="font-semibold text-gray-800">
            Account Settings
          </Typography>
          
          <Box className="p-4 border border-gray-200 rounded-lg mb-4 mt-0" sx={{mt:0}}>
            <Typography variant="subtitle1" className="font-medium mb-2">
              Email Address
            </Typography>
            <Typography variant="body2" className="text-gray-600 mb-3">
              Your email address for account notifications.
            </Typography>
            <TextField
              fullWidth
              value={isEditingEmail ? tempEmail : email}
              onChange={(e) => setTempEmail(e.target.value)}
              disabled={!isEditingEmail}
              variant="outlined"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {isEditingEmail ? (
                      <Box className="flex space-x-1">
                        <IconButton 
                          size="small" 
                          onClick={handleSaveEmail}
                          className="text-green-600 hover:bg-green-50"
                        >
                          <Check fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={handleCancelEditEmail}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton 
                        size="small" 
                        onClick={handleEditEmail}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Box>

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
