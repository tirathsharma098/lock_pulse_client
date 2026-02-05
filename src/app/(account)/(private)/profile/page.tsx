'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Lock, History, ArrowRight, Save, X } from 'lucide-react';
import { useVault } from '@/contexts/VaultContext';
import { toast } from 'sonner';
import ProfileHeader from './components/ProfileHeader';
import UpdatePasswordDialog from './components/UpdatePasswordDialog';
import DeleteAccountDialog from './components/DeleteAccountDialog';
import { userService } from '@/services';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { setUsername, setEmail, username, email } = useVault();
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const router = useRouter();
  const [fullname, setFullname] = useState('');

  const getProfile = async () => {
    try {
      const profile = await userService.getUserProfile();
      setUsername(profile.username);
      setEmail(profile.email);
      setFullname(profile.fullname);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  const handleUpdatePassword = () => {
    setIsUpdatePasswordOpen(true);
  };

  const handleDeleteAccount = () => {
    setIsDeleteAccountOpen(true);
  };

  const handleEditEmail = () => {
    setTempEmail(email!);
    setIsEditingEmail(true);
  };

  const handleSaveEmail = async () => {
    try {
      await userService.updateEmail({ email: tempEmail });
      setIsEditingEmail(false);
      getProfile();
      toast.success('Email updated successfully');
    } catch (err) {
      setTempEmail('');
      setIsEditingEmail(false);
      toast.error('Email update failed');
    }
  };

  const handleCancelEditEmail = () => {
    setTempEmail('');
    setIsEditingEmail(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-8">
          <ProfileHeader fullname={fullname || 'Unknown User'} username={username || 'Unknown User'} />
            {/* Account Settings Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Account Settings
                </h2>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-3 mb-3">
                  <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Email Address
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your email address for account notifications
                    </p>

                    {/* {isEditingEmail ? (
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={tempEmail}
                          onChange={(e) => setTempEmail(e.target.value)}
                          className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Enter email address"
                        />
                        <button
                          onClick={handleSaveEmail}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditEmail}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-white dark:bg-gray-900 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {email || 'No email set'}
                        </span>
                        <button
                          onClick={handleEditEmail}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm flex items-center gap-1"
                        >
                          Edit
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings Section */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Security Settings
                </h2>
              </div>

              <div className="space-y-4">
                {/* Master Password */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Master Password
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Your master password is used to encrypt and decrypt your vault.
                        Updating it will re-encrypt your vault with the new password.
                      </p>
                      <button
                        onClick={handleUpdatePassword}
                        className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        Update Master Password
                      </button>
                    </div>
                  </div>
                </div>

                {/* Auth Logs */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <History className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Security & Activity Logs
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          View all account activities, login history, and security events.
                          Monitor device access and track changes to your account.
                        </p>
                        <button
                          onClick={() => router.push('/profile/logs')}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <History className="w-4 h-4" />
                          View Auth Logs
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/profile/logs')}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10 rounded-xl p-6 border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-red-600 rounded-lg">
                        <X className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          Delete Account
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm hover:shadow-md flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Delete Account
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UpdatePasswordDialog
        open={isUpdatePasswordOpen}
        onClose={() => setIsUpdatePasswordOpen(false)}
        username={username || ''}
      />
      <DeleteAccountDialog
        open={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
      />
    </div>
  );
}
