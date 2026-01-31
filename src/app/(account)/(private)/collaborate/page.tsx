'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { getCollaboratorsForUser } from '@/services/collaborationService';

interface Collaborator {
  id: string;
  username: string;
  email: string;
}

export default function CollaboratePage() {
  const router = useRouter();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const data = await getCollaboratorsForUser();
        setCollaborators(data);
      } catch (error) {
        // console.error('Failed to fetch collaborators');
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborators();
  }, []);

  const handleCollaboratorClick = (collaboratorId: string) => {
    router.push(`/collaborate/${collaboratorId}/shared`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-clip-text">
                Collaborators
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Users who have shared projects with you
              </p>
            </div>
          </div>
        </div>

        {/* Collaborators Grid */}
        {collaborators.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <UserPlus className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Collaborators Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                No one has shared projects with you yet. When someone shares a project, they'll appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                onClick={() => handleCollaboratorClick(collaborator.id)}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {collaborator.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {collaborator.username}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Has shared projects
                      </span>
                    </div>
                    
                    {/* Arrow Icon */}
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors duration-300">
                      <ArrowRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Bottom Border Effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}