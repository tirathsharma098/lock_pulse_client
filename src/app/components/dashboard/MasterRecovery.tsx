import { AlertTriangle, Key } from "lucide-react";

export default function MasterRecovery () {
    return (
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
    );
}