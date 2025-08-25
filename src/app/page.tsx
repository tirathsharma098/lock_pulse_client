'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Box, Typography, Button, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Container maxWidth="md">
        <Paper elevation={3} className="p-8 text-center">
          <Box className="mb-6">
            <LockIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h2" component="h1" className="mb-4 font-bold text-gray-800">
              LockPulse
            </Typography>
            <Typography variant="h5" className="mb-6 text-gray-600">
              Zero Knowledge Password Manager
            </Typography>
            <Typography variant="body1" className="mb-8 text-gray-700 max-w-2xl mx-auto">
              Secure your passwords with military-grade encryption. Your master password never leaves your device, 
              and even we cannot access your data. True zero-knowledge security.
            </Typography>
          </Box>
          
          <Box className="space-x-4">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => router.push('/login')}
              className="mr-4"
            >
              Sign In
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => router.push('/register')}
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
