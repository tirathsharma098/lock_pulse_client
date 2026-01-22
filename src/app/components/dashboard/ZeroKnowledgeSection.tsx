import { useEffect, useState } from "react";
import { Lock, Server, UserCheck } from 'lucide-react';

export default function ZeroKnowledgeSection (){
    const [currentStep, setCurrentStep] = useState(0);
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
    );
}