import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/theme-provider'
import { VaultProvider } from '@/contexts/VaultContext'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LockPulse - Zero-Knowledge Password Manager | 100% Secure Password Storage',
  description: 'LockPulse is a revolutionary zero-knowledge password manager that keeps your passwords truly secure. Client-side encryption ensures even we cannot access your data. Start securing your passwords today.',
  keywords: 'password manager, zero knowledge, secure passwords, encryption, privacy, security, password storage, client-side encryption',
  authors: [{ name: 'LockPulse Team' }],
  creator: 'LockPulse',
  publisher: 'LockPulse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lockpulse.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'LockPulse - Zero-Knowledge Password Manager',
    description: 'Secure your passwords with military-grade encryption. Zero-knowledge architecture means your data stays private, even from us.',
    url: 'https://lockpulse.com',
    siteName: 'LockPulse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LockPulse - Zero-Knowledge Password Manager',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LockPulse - Zero-Knowledge Password Manager',
    description: 'Secure your passwords with military-grade encryption. Zero-knowledge architecture means your data stays private.',
    images: ['/og-image.png'],
    creator: '@lockpulse',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#4682B4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "LockPulse",
              "description": "Zero-knowledge password manager with client-side encryption",
              "url": "https://lockpulse.com",
              "applicationCategory": "SecurityApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "LockPulse"
              }
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Toaster position="top-center" duration={3000} richColors />
        <ThemeProvider defaultTheme="system">
          <VaultProvider>
            {children}
          </VaultProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
