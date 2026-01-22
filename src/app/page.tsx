'use client'

import { useState } from 'react';
import DevFeaturesSection from './components/dashboard/DevFeaturesSection';
import HomeHeader from './components/dashboard/HomeHeader';
import HeroSection from './components/dashboard/HeroSection';
import AboutLockPulseSection from './components/dashboard/AboutLockPulseSection';
import ZeroKnowledgeSection from './components/dashboard/ZeroKnowledgeSection';
import Security100 from './components/dashboard/Security100';
import MasterRecovery from './components/dashboard/MasterRecovery';
import NoServerStorage from './components/dashboard/NoServerStorage';
import CtaSection from './components/dashboard/CtaSection';
import FooterHome from './components/dashboard/FooterHome';

export default function HomePage() {
  const [showDevFeatures, setShowDevFeatures] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <HomeHeader setShowDevFeatures={setShowDevFeatures} showDevFeatures={showDevFeatures} />

      {/* Developer Features Section - Collapsible */}
      <DevFeaturesSection isOpen={showDevFeatures} />

      {/* Hero Section */}
      <HeroSection/>

      {/* What is LockPulse */}
      <AboutLockPulseSection/>

      {/* Zero Knowledge Explanation */}
      <ZeroKnowledgeSection/>

      {/* 100% Security */}
      <Security100/>

      {/* Master Password Recovery */}
      <MasterRecovery/>

      {/* No Server Storage */}
      <NoServerStorage/>

      {/* CTA Section */}
      <CtaSection/>

      {/* Footer */}
      <FooterHome/>
    </div>
  )
}
