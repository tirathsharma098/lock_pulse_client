'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, Key, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import styles from './LoginPresentation.module.css';

export default function LoginPresentation() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Zero-Knowledge Security",
      description: "Your passwords are encrypted client-side"
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Military-Grade Encryption",
      description: "AES-256 encryption protects your data"
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Complete Privacy",
      description: "We mathematically cannot see your passwords"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className={`${styles.floatingElement} absolute top-20 left-10`}>
        <Shield className="h-12 w-12 text-white/20" />
      </div>
      <div className={`${styles.floatingElement} absolute top-40 right-20`} style={{ animationDelay: '2s' }}>
        <Lock className="h-16 w-16 text-white/20" />
      </div>
      <div className={`${styles.floatingElement} absolute bottom-40 left-20`} style={{ animationDelay: '4s' }}>
        <Key className="h-10 w-10 text-white/20" />
      </div>
      <div className={`${styles.floatingElement} absolute bottom-20 right-10`} style={{ animationDelay: '6s' }}>
        <Sparkles className="h-14 w-14 text-white/20" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className={styles.logoContainer}>
              <Shield className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            LockPulse
          </h1>
          <p className="text-xl text-blue-100 font-light">
            Zero-Knowledge Password Manager
          </p>
        </div>

        {/* Rotating Features */}
        <div className="w-full max-w-md">
          <div className={`${styles.featureCard} bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20`}>
            <div className="flex items-center mb-4">
              <div className="text-blue-200 mr-4 transform transition-transform duration-300 hover:scale-110">
                {features[currentFeature].icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {features[currentFeature].title}
                </h3>
                <p className="text-blue-100 text-sm">
                  {features[currentFeature].description}
                </p>
              </div>
            </div>
            
            {/* Progress Indicators */}
            <div className="flex space-x-2 mt-4">
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentFeature 
                      ? 'bg-white w-8' 
                      : 'bg-white/40 w-2'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Stats */}
        <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">256</div>
            <div className="text-xs text-blue-200">Bit Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">0</div>
            <div className="text-xs text-blue-200">Server Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-xs text-blue-200">Private</div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-lg">
            Welcome back! Your vault awaits.
          </p>
          <div className="flex items-center justify-center mt-2 text-blue-200">
            <span className="text-sm">Enter your credentials to unlock</span>
            <ArrowRight className="h-4 w-4 ml-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
