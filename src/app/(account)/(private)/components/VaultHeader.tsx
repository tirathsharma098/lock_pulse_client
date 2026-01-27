'use client';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Chip,
} from '@mui/material';
import {
  Lock as LockIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useVault } from '@/contexts/VaultContext';
import { authService } from '@/services';
import { toast } from 'sonner';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';

export default function VaultHeader() {
    const { wipeVaultKey } = useVault();
    const router = useRouter();
  
    const handleLogout = async () => {
      try {
        await authService.logout();
        wipeVaultKey();
        toast.success('Logged out');
        permanentRedirect("/login");
      } catch {
        wipeVaultKey();
        toast.success('Logged out');
        permanentRedirect("/login");
      }
    };
  
    const handleProfile = () => {
      router.push('/profile');
    };
  
    return (
      <AppBar position="static">
        <Toolbar>
          <LockIcon className="mr-2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href='/vault'> LockPulse</Link>
          </Typography>
          <Chip
            label="Unlocked"
            color="success"
            variant="filled"
            sx={{ color: '#fff', fontWeight: 600 }}
            className="mr-4"
          />
          <IconButton
            color="inherit"
            onClick={handleProfile}
            sx={{ mr: 1 }}
            aria-label="Profile"
          >
            <PersonIcon />
          </IconButton>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
  