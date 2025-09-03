'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Add as AddIcon, Password as PasswordIcon, Description as PageIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllProjects, Project, deleteProject, getProject } from '@/services/projectService';
import CreateProjectDialog from '@/components/projects/CreateProjectDialog';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { decryptCompat, getVaultKey, initSodium } from '@/lib/crypto';
import { Card, CardHeader, CardContent, CardTitle, Button, IconButton, Select, Pagination } from '@/components/ui';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'long'>('all');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');
  const { vaultKey, setProjectVaultKey } = useVault();

  const fetchProjects = async (
    page: number = 1,
    overrideType?: 'all' | 'normal' | 'long',
    overrideSortDir?: 'ASC' | 'DESC'
  ) => {
    try {
      setLoading(true);
      const typeToUse = overrideType ?? filterType;
      const sortDirToUse = overrideSortDir ?? sortDir;
      const response = await getAllProjects(
        `page=${page}&type=${encodeURIComponent(typeToUse)}&sortDir=${encodeURIComponent(sortDirToUse)}`
      );
      setProjects(response.items);
      setTotalPages(Math.ceil(response.total / 10));
      setError(null);
    } catch (err) {
      setError('Failed to load projects');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete project');
      console.error(err);
    }
  };

  const handleProjectClick = async (projectId: string) => {
    if (!vaultKey) {
      toast.error('Vault key not exist.');
      return;
    }
    try {
      const project = await getProject(projectId);
      const currProjPass = await decryptCompat(
        project.passwordNonce,
        project.passwordCiphertext,
        vaultKey
      );
      await initSodium();
      const projectVaultKey = await getVaultKey(currProjPass, project.vaultKdfSalt, project.vaultKdfParams, project.wrappedVaultKey);
      setProjectVaultKey(projectVaultKey);
      router.push(`/project/${project.id}/service`);
    } catch (err) {
      console.error('Failed to access project:', err);
      toast.error('Failed to access project. Please try again.');
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>My Projects</CardTitle>
            <Button
              variant="primary"
              onClick={() => setOpenCreateDialog(true)}
              className="flex items-center space-x-2"
            >
              <AddIcon className="w-4 h-4" />
              <span>Create Project</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Select
              label="Filter"
              value={filterType}
              onValueChange={(value) => {
                const nextType = value as 'all' | 'normal' | 'long';
                setFilterType(nextType);
                setPage(1);
                fetchProjects(1, nextType, sortDir);
              }}
              options={[
                { value: 'all', label: 'All' },
                { value: 'normal', label: 'Normal' },
                { value: 'long', label: 'Long' }
              ]}
            />
            <Select
              label="Order (by date)"
              value={sortDir}
              onValueChange={(value) => {
                const nextDir = value.toUpperCase() as 'ASC' | 'DESC';
                setSortDir(nextDir);
                setPage(1);
                fetchProjects(1, filterType, nextDir);
              }}
              options={[
                { value: 'DESC', label: 'Newest first' },
                { value: 'ASC', label: 'Oldest first' }
              ]}
            />
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                You don't have any projects yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first project to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={() => handleProjectClick(project.id)}>
                      <div className="text-gray-400">
                        {project.isLong ? <PageIcon /> : <PasswordIcon />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600">{project.name}</h4>
                        <p className="text-sm text-gray-500">
                          {project.notes || 'No description'}
                          {project.isLong && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                              Long Password
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IconButton 
                        onClick={() => router.push(`/project/${project.id}/view`)}
                        variant="ghost"
                        title="View details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => router.push(`/project/${project.id}/edit`)}
                        variant="ghost"
                        title="Edit details"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteProject(project.id)}
                        variant="destructive"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      fetchProjects(newPage);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CreateProjectDialog 
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onProjectCreated={() => {
          fetchProjects();
          setOpenCreateDialog(false);
        }}
      />
    </div>
  );
}