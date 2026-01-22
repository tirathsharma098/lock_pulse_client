import { Shield} from 'lucide-react';

export default function AboutLockPulseSection(){
    return (
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
    );
}