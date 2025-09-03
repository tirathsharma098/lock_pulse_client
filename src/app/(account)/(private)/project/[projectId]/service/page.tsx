'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Password as PasswordIcon, Description as PageIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllServices, Service, deleteService, getService } from '@/services/serviceService';
import { getProject, Project } from '@/services/projectService';
import CreateServiceDialog from '@/components/projects/services/CreateServiceDialog';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { decryptCompat, getVaultKey, initSodium } from '@/lib/crypto';
import { Card, CardHeader, CardContent, CardTitle, Button, IconButton } from '@/components/ui';

export default function ServicesPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const { projectVaultKey, setServiceVaultKey } = useVault();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectData, servicesData] = await Promise.all([
        getProject(projectId),
        getAllServices(projectId)
      ]);
      setProject(projectData);
      setServices(servicesData);
      setError(null);
    } catch (err) {
      setError('Failed to load services');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(projectId, serviceId);
      toast.success('Service deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete service');
      console.error(err);
    }
  };

  const handleCredentialRoute = async (service: any) => {
    if (!service || !projectVaultKey){
      toast.error('Vault key not exist.');
      return;
    }
    console.log(">>>>>> service got :: ", service);
      try {
        const gotCurrService = await getService(projectId, service.id);
        // Decrypt service password
        const servicePassword = await decryptCompat(
          gotCurrService.passwordNonce,
          gotCurrService.passwordCiphertext,
          projectVaultKey,
        );
        
        // Unwrap service vault key
        await initSodium();
        const serviceVaultKey = await getVaultKey(
          servicePassword,
          gotCurrService.vaultKdfSalt,
          service.vaultKdfParams,
          gotCurrService.wrappedVaultKey,
        );
        
        // Store service vault key in context
        setServiceVaultKey(serviceVaultKey);
        
        // Navigate to credentials page
        router.push(`/project/${projectId}/service/${service.id}/credential`);
      } catch (err) {
        console.error('Failed to unlock service:', err);
        setError('Failed to unlock service');
      }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                onClick={() => router.push('/project')}
                className="flex items-center space-x-2"
              >
                <ArrowBackIcon className="w-4 h-4" />
                <span>Back to Projects</span>
              </Button>
              <CardTitle>{project?.name || 'Project'} Services</CardTitle>
            </div>
            <Button
              variant="primary"
              onClick={() => setOpenCreateDialog(true)}
              className="flex items-center space-x-2"
            >
              <AddIcon className="w-4 h-4" />
              <span>Create Service</span>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No services created yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first service to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3 flex-1 cursor-pointer" onClick={() => handleCredentialRoute(service)}>
                    <div className="text-gray-400">
                      {service.isLong ? <PageIcon /> : <PasswordIcon />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 hover:text-blue-600">{service.name}</h4>
                      <p className="text-sm text-gray-500">
                        {service.notes || 'No description'}
                        {service.isLong && (
                          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                            Long Password
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IconButton 
                      onClick={() => router.push(`/project/${projectId}/service/${service.id}/view`)}
                      variant="ghost"
                      title="View details"
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => router.push(`/project/${projectId}/service/${service.id}/edit`)}
                      variant="ghost"
                      title="Edit details"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDeleteService(service.id)}
                      variant="destructive"
                      title="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateServiceDialog 
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onServiceCreated={() => {
          fetchData();
          setOpenCreateDialog(false);
        }}
        projectId={projectId}
      />
    </div>
  );
}