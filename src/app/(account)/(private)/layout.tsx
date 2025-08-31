'use client';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Chip,
  Container,
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
import AppBreadCrumb from './components/AppBreadCrumb';


function VaultHeader() {
  const { wipeVaultKey } = useVault();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      wipeVaultKey();
      toast.success('Logged out');
      router.push('/');
    } catch {
      wipeVaultKey();
      toast.success('Logged out');
      router.push('/');
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

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <VaultHeader />
      <Container maxWidth="md" className="pt-8">
        <AppBreadCrumb />
        <main className="pt-6">{children}</main>
      </Container>
    </div>
  );
}
