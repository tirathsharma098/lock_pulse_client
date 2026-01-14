'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from "next/navigation";
import { Add as AddIcon, ArrowBack as ArrowBackIcon, Password as PasswordIcon, Description as PageIcon, Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getAllCredentials, Credential, deleteCredential } from '@/services/credentialService';
import { getService, Service } from '@/services/serviceService';
import CreateCredentialDialog from '@/components/projects/services/credentials/CreateCredentialDialog';
import { useVault } from '@/contexts/VaultContext';
import { decryptCompat } from '@/lib/crypto';
import { toast } from 'sonner';
import { Card, CardHeader, CardContent, CardTitle, Button, IconButton, Select, Pagination } from '@/components/ui';
import { Box } from '@mui/material';

export default function CredentialsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const serviceId = params.serviceId as string;
  const router = useRouter();
  const { serviceVaultKey } = useVault();
  const [service, setService] = useState<Service | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [decryptedTitles, setDecryptedTitles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<'all' | 'normal' | 'long'>('all');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  const fetchData = async (
    page: number = 1,
    overrideType?: 'all' | 'normal' | 'long',
    overrideSortDir?: 'ASC' | 'DESC'
  ) => {
    try {
      setLoading(true);
      const typeToUse = overrideType ?? filterType;
      const sortDirToUse = overrideSortDir ?? sortDir;
      const [serviceData, credentialsResponse] = await Promise.all([
        getService(projectId, serviceId),
        getAllCredentials(projectId, serviceId, `page=${page}&type=${encodeURIComponent(typeToUse)}&sortDir=${encodeURIComponent(sortDirToUse)}`)
      ]);
      setService(serviceData);
      setCredentials(credentialsResponse.items);
      setTotalPages(Math.ceil(credentialsResponse.total / 10));
      
      // Decrypt credential titles
      if (serviceVaultKey && credentialsResponse.items.length > 0) {
        await decryptCredentialTitles(credentialsResponse.items);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load credentials');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const decryptCredentialTitles = async (credentialsData: Credential[]) => {
    if (!serviceVaultKey) return;
    
    const titles: Record<string, string> = {};
    for (const credential of credentialsData) {
      try {
        const decryptedTitle = await decryptCompat(
          credential.titleNonce,
          credential.titleCiphertext,
          serviceVaultKey
        );
        titles[credential.id] = decryptedTitle;
      } catch (err) {
        console.error(`Failed to decrypt title for credential ${credential.id}:`, err);
        titles[credential.id] = 'Unable to decrypt title';
      }
    }
    setDecryptedTitles(titles);
  };

  useEffect(() => {
    fetchData(page);
  }, [projectId, serviceId, serviceVaultKey, page]);

  const handleDeleteCredential = async (credentialId: string) => {
    try {
      await deleteCredential(projectId, serviceId, credentialId);
      toast.success('Credential deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete credential');
      console.error(err);
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
                onClick={() => router.back(/*`/project/${projectId}/service`*/)}
                className="flex items-center space-x-2"
              >
                <ArrowBackIcon className="w-4 h-4" />
                <span>Back to Services</span>
              </Button>
              <CardTitle>{service?.name || 'Service'} Credentials</CardTitle>
            </div>
            <Button
              variant="primary"
              onClick={() => setOpenCreateDialog(true)}
              className="flex items-center space-x-2"
            >
              <AddIcon className="w-4 h-4" />
              <span>Create Credential</span>
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
                fetchData(1, nextType, sortDir);
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
                fetchData(1, filterType, nextDir);
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
          ) : credentials.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No credentials created yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first credential to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {credentials.map((credential) => (
                  <div key={credential.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Box 
                      className="flex items-center space-x-3 flex-1 cursor-pointer" 
                      onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential/${credential.id}/view`)}
                      title="View Credential"
                    >
                      <div className="text-gray-400">
                        {credential.isLong ? <PageIcon /> : <PasswordIcon />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 hover:text-blue-600">
                          {decryptedTitles[credential.id] || 'Loading...'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(credential.createdAt).toLocaleDateString()}
                          {credential.isLong && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded font-medium">
                              Long Password
                            </span>
                          )}
                        </p>
                      </div>
                    </Box>
                    <div className="flex items-center space-x-1">
                      <IconButton 
                        onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential/${credential.id}/view`)}
                        variant="ghost"
                        title="View details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => router.push(`/project/${projectId}/service/${serviceId}/credential/${credential.id}/edit`)}
                        variant="ghost"
                        title="Edit details"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteCredential(credential.id)}
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
                      fetchData(newPage);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CreateCredentialDialog 
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCredentialCreated={() => {
          fetchData();
          setOpenCreateDialog(false);
        }}
        projectId={projectId}
        serviceId={serviceId}
      />
    </div>
  );
}