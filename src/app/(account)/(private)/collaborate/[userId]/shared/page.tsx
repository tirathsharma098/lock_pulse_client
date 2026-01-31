'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lock, Calendar, X, Eye, EyeOff, Folder, AlertCircle } from 'lucide-react';
import { useVault } from '@/contexts/VaultContext';
import { getSharedProjects, getProjectDetails } from '@/services/collaborationService';
import { getVaultKey, VaultKdfParams } from '@/lib/crypto';

interface SharedProject {
  id: string;
  title: string;
  summary: string;
  vaultKdfSalt: string;
  vaultKdfParams: VaultKdfParams;
  wrappedVaultKey: string;
  sharedAt: string;
}

export default function CollaboratorProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const { setCollaboratorId, setIsCollaborating, setProjectVaultKey } = useVault();
  const userId: string = params.userId as string;

  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordDialog, setPasswordDialog] = useState<{
    open: boolean;
    project: SharedProject | null;
  }>({ open: false, project: null });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getSharedProjects(userId);
        setProjects(data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to fetch shared projects',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleProjectClick = (project: SharedProject) => {
    setPasswordDialog({ open: true, project });
    setPassword('');
    setShowPassword(false);
    setError(null);
  };

  const handleUnlockProject = async () => {
    if (!passwordDialog.project || !password) {
      setError('Please enter a password');
      return;
    }

    setUnlocking(true);
    setError(null);
    try {
      const projectId = passwordDialog.project.id;
      const projectDetails = await getProjectDetails(projectId);

      const vaultKey = await getVaultKey(
        password,
        projectDetails.vaultKdfSalt,
        projectDetails.vaultKdfParams,
        projectDetails.wrappedVaultKey
      );

      setProjectVaultKey(vaultKey);
      setIsCollaborating(true);
      setCollaboratorId(userId as string);
      router.push(`/project/${projectId}/service`);

      setPasswordDialog({ open: false, project: null });
      setPassword('');
    } catch (error) {
      setError('Invalid password or failed to unlock project');
    } finally {
      setUnlocking(false);
    }
  };

  const handleDialogClose = () => {
    setPasswordDialog({ open: false, project: null });
    setPassword('');
    setShowPassword(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Folder className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text">
                Shared Projects
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Projects shared with you by this collaborator
              </p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Lock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Shared Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                No projects have been shared with you by this user yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative p-6">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 min-h-[60px]">
                    {project.summary || 'No description provided'}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(project.sharedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300">
                      Shared
                    </div>
                  </div>
                </div>

                {/* Bottom Border Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}

        {/* Password Dialog */}
        {passwordDialog.open && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Unlock Project
                    </h3>
                    <p className="text-purple-100 text-sm line-clamp-1">
                      {passwordDialog.project?.title}
                    </p>
                  </div>
                  <button
                    onClick={handleDialogClose}
                    disabled={unlocking}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the project password to access its contents.
                </p>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                {/* Password Input */}
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && password && !unlocking) {
                        handleUnlockProject();
                      }
                    }}
                    disabled={unlocking}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={handleDialogClose}
                  disabled={unlocking}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlockProject}
                  disabled={!password || unlocking}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {unlocking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Unlocking...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Unlock</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {snackbar.open && (
          <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5">
            <div
              className={`px-6 py-4 rounded-xl shadow-lg border ${
                snackbar.severity === 'error'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                  : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{snackbar.message}</p>
                <button
                  onClick={() => setSnackbar({ ...snackbar, open: false })}
                  className="ml-2 p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}