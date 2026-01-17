'use client'

import Link from 'next/link'
import { Users, FolderGit2, ChevronDown, Shield, Share2, Lock } from 'lucide-react'

interface DevFeaturesSectionProps {
  isOpen: boolean
}

export default function DevFeaturesSection({ isOpen }: DevFeaturesSectionProps) {
  return (
    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
      isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto">
          {/* Main Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 mb-6">
            {/* Project Management */}
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-primary/30 hover:border-primary transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <FolderGit2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Project-Based Organization</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                Organize your credentials hierarchically: Projects contain Services (AWS, GitHub, etc.), 
                and each Service can store multiple credentials.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span><strong className="text-gray-300">Projects</strong> - Group related services together</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span><strong className="text-gray-300">Services</strong> - Add platforms like AWS, GitHub, databases</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span><strong className="text-gray-300">Credentials</strong> - Store multiple credentials per service</span>
                </li>
              </ul>
            </div>

            {/* Collaboration */}
            <div className="bg-slate-800 rounded-xl p-4 sm:p-6 border border-primary/30 hover:border-primary transition-all duration-300">
              <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-white">Secure Project Sharing</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                Share entire projects with team members using OPAQUE protocol. 
                Access is controlled by project-specific passwords shared out-of-band.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span>Search and share projects with other users by username</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span>Collaborators enter project password to decrypt shared data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 flex-shrink-0">•</span>
                  <span>Remove access instantly - revoke sharing anytime</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How It Works - Responsive Flow */}
          <div className="bg-slate-900/50 rounded-xl p-4 sm:p-6 border border-slate-700 mb-4 sm:mb-6">
            <h4 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 flex items-center">
              <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary mr-2 flex-shrink-0" />
              How Collaboration Works
            </h4>
            
            {/* Mobile: Vertical Stack, Desktop: Grid */}
            <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4">
              <div className="flex sm:flex-col items-start sm:items-center space-x-3 sm:space-x-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 sm:mb-2">
                  1
                </div>
                <div className="flex-1 sm:text-center">
                  <p className="text-sm sm:text-base text-gray-300 font-semibold">Owner Shares</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Search username, select user, share project</p>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-start sm:items-center space-x-3 sm:space-x-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 sm:mb-2">
                  2
                </div>
                <div className="flex-1 sm:text-center">
                  <p className="text-sm sm:text-base text-gray-300 font-semibold">External Password</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Owner shares project password via secure channel</p>
                </div>
              </div>
              
              <div className="flex sm:flex-col items-start sm:items-center space-x-3 sm:space-x-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 sm:mb-2">
                  3
                </div>
                <div className="flex-1 sm:text-center">
                  <p className="text-sm sm:text-base text-gray-300 font-semibold">Decrypt & Access</p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Collaborator enters password to view services</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="bg-slate-800 rounded-lg p-3 sm:p-4 border border-primary/20 mb-4 sm:mb-6">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm text-gray-300">
                  <strong className="text-white">OPAQUE Protocol Security:</strong> All sharing uses cryptographic 
                  protocols. No role-based access control - project passwords provide all-or-nothing access. 
                  LockPulse servers never see decrypted data.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link 
              href="/register" 
              className="inline-flex items-center justify-center space-x-2 text-primary hover:text-primary-light transition-colors duration-300 text-sm sm:text-base"
            >
              <span className="font-semibold">Create account to start organizing your projects</span>
              <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
