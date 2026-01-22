'use client';

import Link from 'next/link';
import { Shield, Lock, Key } from 'lucide-react';

export default function HeroSection() {

    {/* Hero Section */}
    return (
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
        </section>);
}