'use client';

import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton,
  Chip,
  Breadcrumbs,
  Container
} from '@mui/material';
import {
  Lock as LockIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useVault } from '@/contexts/VaultContext';
import { authService } from '@/services';
import { toast } from 'sonner';
import Link from 'next/link';

function VaultBreadcrumbs() {
  const pathname = usePathname();
  const router = useRouter();

  const breadcrumbMap: Record<string, string> = {
    '/vault': 'Vault',
    '/vault/profile': 'Profile',
  };

  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Build breadcrumb trail
  let currentPath = '';
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    const label = breadcrumbMap[currentPath];
    if (label) {
      breadcrumbs.push({
        path: currentPath,
        label,
        isCurrent: currentPath === pathname
      });
    }
  }

  if (breadcrumbs.length <= 1) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 1 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb) => (
          crumb.isCurrent ? (
            <Typography key={crumb.path} color="text.primary" sx={{ fontWeight: 500 }}>
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={crumb.path}
              href={crumb.path}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                opacity: 0.7
              }}
            >
              <Typography
                sx={{
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 1
                  }
                }}
              >
                {crumb.label}
              </Typography>
            </Link>
          )
        ))}
      </Breadcrumbs>
    </Container>
  );
}

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
    router.push('/vault/profile');
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

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <VaultHeader />
      <VaultBreadcrumbs />
      {children}
    </div>
  );
}
