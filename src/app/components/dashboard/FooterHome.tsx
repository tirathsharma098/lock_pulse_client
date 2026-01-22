import { Shield } from "lucide-react";
import Link from "next/link";

export default function FooterHome() {
    return (<footer className="border-t border-slate-700 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-white">LockPulse</span>
              </div>
              <p className="text-gray-400 text-sm">
                Zero-knowledge password storage for everyone.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/register" className="hover:text-primary">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-primary">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Security</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog/what-is-zero-knowledge-password-manager" className="hover:text-primary">Zero-Knowledge Security</Link></li>
                <li><Link href="/blog/client-side-encryption-explained" className="hover:text-primary">Client-Side Encryption</Link></li>
                <li><Link href="/blog/aes-256-encryption-standard" className="hover:text-primary">AES-256 Encryption</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog/project-based-credential-management" className="hover:text-primary">Project Management</Link></li>
                <li><Link href="/blog/team-credential-management" className="hover:text-primary">Team Collaboration</Link></li>
                <li><Link href="/blog/getting-started-lockpulse" className="hover:text-primary">Getting Started</Link></li>
                <li><Link href="/blog/security-best-practices" className="hover:text-primary">Best Practices</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
              <p>&copy; 2025 LockPulse. Your security is our priority.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="/blog/password-manager-comparison" className="hover:text-primary">Why LockPulse</Link>
                <Link href="/blog/managing-aws-credentials-securely" className="hover:text-primary">AWS Security</Link>
                <Link href="/blog/github-token-security" className="hover:text-primary">GitHub Security</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>)
}