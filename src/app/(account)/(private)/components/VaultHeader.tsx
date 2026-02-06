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
        <AppBar position="static" className="bg-slate-900/80 backdrop-blur border-b border-slate-800 shadow-sm">
          <Toolbar className="min-h-[64px] gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800/70 ring-1 ring-slate-700">
                <LockIcon className="text-slate-100" />
              </span>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="font-semibold tracking-tight text-slate-100">
                <Link href="/vault" className="hover:text-white">LockPulse</Link>
              </Typography>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Chip
                label="Unlocked"
                color="success"
                variant="filled"
                sx={{ color: '#fff', fontWeight: 600 }}
                className="rounded-full px-1 shadow-sm"
              />
              <IconButton
                color="inherit"
                onClick={handleProfile}
                aria-label="Profile"
                className="rounded-xl bg-slate-800/60 hover:bg-slate-700/70 transition-colors"
              >
                <PersonIcon />
              </IconButton>
              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                className="rounded-xl bg-slate-800/60 hover:bg-slate-700/70 px-4 py-2 font-medium normal-case transition-colors"
              >
                Logout
              </Button>
            </div>
          </Toolbar>
        </AppBar>
    );
  }
  