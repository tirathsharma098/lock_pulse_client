'use client';

import { useState, useEffect } from 'react';
import { Shield, UserPlus, Zap, Star, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import styles from './RegisterPresentation.module.css';

export default function RegisterPresentation() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Create Your Account",
      description: "Join thousands of security-conscious users"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Set Master Password",
      description: "Your only key to unlock your vault"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Start Securing",
      description: "Begin storing passwords safely"
    }
  ];

  const benefits = [
    "Zero-knowledge encryption",
    "Military-grade security",
    "Cross-platform access",
    "Open source transparency"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`${styles.patternDot} absolute rounded-full bg-white/10`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className={`${styles.floatingElement} absolute top-16 left-8`}>
        <Star className="h-12 w-12 text-white/20" />
      </div>
      <div className={`${styles.floatingElement} absolute top-32 right-16`} style={{ animationDelay: '2s' }}>
        <Sparkles className="h-14 w-14 text-white/20" />
      </div>
      <div className={`${styles.floatingElement} absolute bottom-32 left-16`} style={{ animationDelay: '4s' }}>
        <Shield className="h-16 w-16 text-white/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className={styles.welcomeBadge}>
            <span className="text-sm font-medium">Welcome to the Future</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
            Join LockPulse
          </h1>
          <p className="text-xl text-emerald-100 font-light">
            Where your passwords are truly yours
          </p>
        </div>

        {/* Animated Steps */}
        <div className="w-full max-w-md mb-8">
          <div className={`${styles.stepCard} bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20`}>
            <div className="flex items-center mb-4">
              <div className={`${styles.stepIcon} text-emerald-200 mr-4`}>
                {steps[currentStep].icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Step {currentStep + 1}: {steps[currentStep].title}
                </h3>
                <p className="text-emerald-100 text-sm">
                  {steps[currentStep].description}
                </p>
              </div>
            </div>
            
            {/* Step Progress */}
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    index <= currentStep 
                      ? 'bg-white w-6' 
                      : 'bg-white/40 w-2'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="w-full max-w-md mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Why Choose LockPulse?
          </h3>
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`${styles.benefitItem} flex items-center bg-white/5 rounded-lg p-3 backdrop-blur-sm`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CheckCircle className="h-5 w-5 text-emerald-300 mr-3 flex-shrink-0" />
                <span className="text-emerald-50 text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <p className="text-emerald-100 text-lg mb-2">
            Ready to secure your digital life?
          </p>
          <div className="flex items-center justify-center text-emerald-200">
            <span className="text-sm">Create your account now</span>
            <ArrowRight className="h-4 w-4 ml-2 animate-pulse" />
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 text-center">
          <div className={styles.trustBadge}>
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-xs">Bank-level security guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
