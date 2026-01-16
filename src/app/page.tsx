'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Shield, Lock, Key, Eye, EyeOff, Server, UserCheck, AlertTriangle, Users, FolderGit2, ChevronDown } from 'lucide-react'
import DevFeaturesSection from './components/dashboard/DevFeaturesSection'

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showDevFeatures, setShowDevFeatures] = useState(false)

  const securitySteps = [
    { title: "Your Password", description: "Enter your password locally" },
    { title: "Client-Side Encryption", description: "Encrypted in your browser" },
    { title: "Zero Knowledge", description: "We never see your data" },
    { title: "Secure Storage", description: "Safely stored encrypted" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % securitySteps.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">LockPulse</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowDevFeatures(!showDevFeatures)}
              className="text-sm text-gray-300 hover:text-primary transition-colors duration-300 flex items-center space-x-1"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">For Developers & Teams</span>
              <span className="sm:hidden">For Teams</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showDevFeatures ? 'rotate-180' : ''}`} />
            </button>
            <Link href="/login" className="bg-transparent border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all duration-300">
              Sign In
            </Link>
            <Link href="/register" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all duration-300 hidden sm:block">
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Developer Features Section - Collapsible */}
      <DevFeaturesSection isOpen={showDevFeatures} />

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Passwords,
            <span className="text-primary block">Truly Secure</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Zero-knowledge password storage that keeps your secrets safe, even from us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
              Get Started Free
            </Link>
            <button className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float hidden lg:block">
          <Lock className="h-12 w-12 text-primary opacity-20" />
        </div>
        <div className="absolute top-40 right-16 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>
          <Shield className="h-16 w-16 text-primary-light opacity-20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-float hidden lg:block" style={{ animationDelay: '4s' }}>
          <Key className="h-10 w-10 text-primary opacity-20" />
        </div>
      </section>

      {/* What is LockPulse */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            What is <span className="text-primary">LockPulse</span>?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                LockPulse is a revolutionary password manager built on the principle of 
                <strong className="text-primary"> zero-knowledge architecture</strong>. 
                This means your passwords are encrypted and decrypted entirely on your device, 
                never leaving your control in readable form.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Unlike traditional password managers, we mathematically cannot access your data. 
                Your master password is the only key to your vault, and it never leaves your device.
              </p>
              <div className="flex items-center space-x-3 text-primary">
                <Shield className="h-6 w-6" />
                <span className="font-semibold">End-to-end encrypted by design</span>
              </div>
            </div>
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                    <div className="h-4 bg-primary rounded w-1/2"></div>
                    <div className="h-4 bg-slate-600 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero Knowledge Explanation */}
      <section className="container mx-auto px-6 py-20 bg-slate-800/30 rounded-3xl my-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Zero-Knowledge <span className="text-primary">Security</span>
          </h2>
          
          {/* Interactive Demo */}
          <div className="relative mb-16">
            {/* Connection Lines - Hidden on mobile */}
            <div className="absolute top-8 left-16 right-16 h-1 bg-gray-600 hidden md:block z-0">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStep / (securitySteps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 relative z-10">
              {securitySteps.map((step, index) => (
                <div key={index} className={`flex flex-col items-center transition-all duration-500 ${
                  index === currentStep ? 'scale-110' : 'opacity-99'
                } flex-1 max-w-40`}>
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center mb-3 bg-slate-800 ${
                    index === currentStep ? 'border-primary bg-primary text-white' : 'border-gray-500 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-white text-center text-sm md:text-base">{step.title}</h3>
                  <p className="text-xs md:text-sm text-gray-400 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold text-white">Client-Side Encryption</h3>
              </div>
              <p className="text-gray-300">
                Your passwords are encrypted using AES-256 encryption directly in your browser. 
                The encryption key is derived from your master password and never leaves your device.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold text-white">Server Blindness</h3>
              </div>
              <p className="text-gray-300">
                Our servers only store encrypted data blobs. We cannot decrypt, read, or access 
                your passwords in any way. Even our administrators cannot see your data.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <div className="flex items-center space-x-3 mb-4">
                <UserCheck className="h-8 w-8 text-primary" />
                <h3 className="text-xl font-bold text-white">You Control Everything</h3>
              </div>
              <p className="text-gray-300">
                You are the only person who can decrypt your passwords. Your master password 
                is never transmitted to our servers, ensuring complete privacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Security */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
            <span className="text-primary">100%</span> Secure by Design
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Military-Grade Encryption</h3>
                  <p className="text-gray-300">AES-256 encryption with PBKDF2 key derivation</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Zero Server-Side Decryption</h3>
                  <p className="text-gray-300">Mathematically impossible for us to access your data</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-white mb-2">Open Source Transparency</h3>
                  <p className="text-gray-300">Our code is auditable by security experts worldwide</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 mx-auto relative">
                <div className="absolute inset-0 border-4 border-primary rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-4 border-4 border-primary-light rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute inset-8 border-4 border-primary rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="h-16 w-16 md:h-20 md:w-20 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Password Recovery */}
      <section className="container mx-auto px-6 py-20 bg-slate-800/30 rounded-3xl my-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Master Password is Your <span className="text-primary">Only Key</span>
          </h2>
          <div className="bg-slate-800 rounded-xl p-8 border-l-4 border-yellow-500">
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Your master password is the only way to decrypt your vault. 
              <strong className="text-white"> If you forget it, your passwords remain safe but unrecoverable.</strong>
            </p>
            <p className="text-lg text-gray-400 mb-6">
              This isn&apos;t a limitation—it&apos;s a feature. Even if LockPulse is compromised, 
              your passwords remain encrypted and useless without your master password.
            </p>
            <div className="inline-flex items-center space-x-2 bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-lg">
              <Key className="h-5 w-5" />
              <span className="font-semibold">Choose a master password you&apos;ll remember</span>
            </div>
          </div>
        </div>
      </section>

      {/* No Server Storage */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
            Your Data Never Touches Our Servers
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✗</span>
                    </div>
                    Traditional Password Managers
                  </h3>
                  <p className="text-gray-300 text-sm">Store encrypted passwords on servers with server-side keys</p>
                </div>
                
                <div className="bg-slate-800 rounded-xl p-6 border border-primary">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    LockPulse Zero-Knowledge
                  </h3>
                  <p className="text-gray-300 text-sm">Only stores encrypted blobs - no keys, no plaintext, no access</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-48 h-48 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Server className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Server</p>
                      <p className="text-gray-600 text-xs">Sees only encrypted data</p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                    <EyeOff className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Take Control of Your Passwords?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust LockPulse for truly secure password management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-all duration-300 transform hover:scale-105">
              Start Securing Your Passwords
            </Link>
            <Link href="/login" className="border border-primary text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300">
              Already Have an Account?
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">LockPulse</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2025 LockPulse. Your security is our priority.</p>
              <p className="text-sm mt-1">Zero-knowledge password storage for everyone.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
