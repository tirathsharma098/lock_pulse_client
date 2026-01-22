import { Eye, EyeOff, Server } from 'lucide-react';

export default function NoServerStorage() {
    return (<section className="container mx-auto px-6 py-20">
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
      </section>);
}