'use client';

import { 
  Container,
} from '@mui/material';
import AppBreadCrumb from './components/AppBreadCrumb';
import VaultHeader from './components/VaultHeader';
import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import FullPageSpinner from '@/components/ui/full-page-loader';
import { useVault } from '@/contexts/VaultContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInitialLoad, setIsInitialLoad] = useState(false);
  const { vaultKey, wipeVaultKey } = useVault();
  // const router = useRouter();
    useEffect(()=> {
      const handleBeforeLoad = async () => {
        try{
          const res = await fetch('api/auth/check-cookie',{
            credentials: 'include'
          });
          const data = await res.json();
          if (!data.success )
          window.location.href = "/login"
          else if (data.success && !vaultKey){
            await fetch('/api/auth/check-cookie', {
              credentials: 'include',
              method: 'POST',
            })
            window.location.href = "/login";
          } else{
            setIsInitialLoad(true);
          }
        } catch(err){
          toast.error("Something went wrong");
          // router.replace('/login');
          window.location.href = "/login"
        }
      }
      handleBeforeLoad();
    }, []);
  return (isInitialLoad ?
    <div className="min-h-screen bg-gray-50">
      <VaultHeader />
      <Container maxWidth="md" className="pt-8">
        <AppBreadCrumb />
        <main className="pt-6">{children}</main>
      </Container>
    </div> : <FullPageSpinner/>
  );
}
