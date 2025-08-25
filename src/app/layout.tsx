import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import { VaultProvider } from '@/contexts/VaultContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LockPulse',
  description: 'Smart lock management system',
  keywords: 'smart lock, security, IoT, home automation',
  authors: [{ name: 'LockPulse Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <VaultProvider>
            {children}
          </VaultProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
