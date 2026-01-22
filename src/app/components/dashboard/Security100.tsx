import { Shield } from "lucide-react";

export default function Security100(){
    return (<section className="container mx-auto px-6 py-20">
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
      </section>);
}