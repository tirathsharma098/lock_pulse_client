'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Password as PasswordIcon,
  Description as PageIcon,
} from '@mui/icons-material';
import { toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { authService, vaultService, type VaultItem } from '@/services';
import { decryptCompat, initSodium } from '@/lib/crypto';
import AddPasswordDialog from './components/AddPasswordDialog';
import ViewPasswordDialog from './components/ViewPasswordDialog';
import { Edit2Icon, EditIcon } from 'lucide-react';
import EditPasswordDialog from './components/EditPasswordDialog';
import { Card, CardHeader, CardContent, CardTitle, Button, Select, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, IconButton, Pagination } from '@/components/ui';

interface DecryptedVaultItem extends VaultItem {
  title: string;
}

export default function VaultPage() {
  const { vaultKey, isUnlocked, wipeVaultKey } = useVault();
  const router = useRouter();
  const [items, setItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'normal' | 'long'>('all');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  const clearVaultStateData = () => {
    console.debug('[vault] Missing/invalid vaultKey. length=', vaultKey?.length);
    setItems([]);
    setSelectedItemId(null);
    setAddDialogOpen(false);
    setViewDialogOpen(false);
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    toast.info('Session expired. Please log in again.');
    wipeVaultKey();
    router.replace('/login');
    setLoading(false);
    return;
  }

  useEffect(() => {
    if (!isUnlocked) {
      return clearVaultStateData();
    }
    console.debug('[vault] useEffect loadItems page=', page, 'isUnlocked=', isUnlocked, 'vaultKeyLen=', vaultKey?.length);
    loadItems(page);
  }, [isUnlocked, page]);

  const loadItems = async (
    page: number = 1,
    overrideType?: 'all' | 'normal' | 'long',
    overrideSortDir?: 'ASC' | 'DESC'
  ) => {
    if (!vaultKey || vaultKey.length !== 32) {
      return clearVaultStateData();
    }

    try {
      setLoading(true);
      await initSodium();
      console.debug('[vault] initSodium done. Fetching items page=', page);

      const typeToUse = overrideType ?? filterType;
      const sortDirToUse = overrideSortDir ?? sortDir;
      const response = await vaultService.getItems(
        `page=${page}&type=${encodeURIComponent(typeToUse)}&sortDir=${encodeURIComponent(sortDirToUse)}`
      );
      console.debug('[vault] api.getItems ok:', {
        page: response.page,
        count: response.items?.length,
        total: response.total,
        type: typeToUse,
        sortDir: sortDirToUse,
      });

      const decryptedItems = [];
      for (const item of response.items) {
        let title = "";
        try {
          title = await decryptCompat(
            item.titleNonce,
            item.titleCiphertext,
            vaultKey
          );
        } catch (err: any) {
          console.debug("> Compact decryption failed :: ", err);
          title = "Decryption failed";
        }
        decryptedItems.push({ ...item, title });
      }

      setItems(decryptedItems);
      setTotalPages(Math.ceil(response.total / 10));
      setError('');
    }catch(err:any){
      console.debug("Api Error:: ", err);
      if (err?.status === 401 || err?.response?.status === 401) {
        toast.info("Session expired. Please log in again.");
        clearVaultStateData();
        return;
      }
      // setError(err?.message || "Failed to load vault items");
    }finally {
      setLoading(false);
    }
  };

  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setViewDialogOpen(true);
  };
  const handleEditItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setEditDialogOpen(true);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await vaultService.deleteItem(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      toast.success('Password deleted');
      loadItems();
    } catch (err: any) {
      if (err?.status === 401 || err?.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        wipeVaultKey();
        router.replace('/login');
        return;
      }
      setError('Failed to delete item');
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError('')}
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
            <CardTitle>Password Vault</CardTitle>
            <Button
              variant="primary"
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <AddIcon className="w-4 h-4" />
              <span>Add Password</span>
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
                loadItems(1, nextType, sortDir);
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
                loadItems(1, filterType, nextDir);
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
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No passwords saved yet
              </h3>
              <p className="text-gray-500 mb-4">
                Click "Add Password" to create your first entry
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-400">
                        {item.isLong ? <PageIcon /> : <PasswordIcon />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          Password: •••••••• • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IconButton 
                        onClick={() => handleViewItem(item.id)} 
                        variant="ghost"
                        title="View details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleEditItem(item.id)} 
                        variant="ghost"
                        title="Edit details"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setItemToDelete(item.id);
                          setDeleteDialogOpen(true);
                        }}
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
                      loadItems(newPage);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AddPasswordDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={() => loadItems()}
      />

      <ViewPasswordDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        itemId={selectedItemId}
      />
      
      {editDialogOpen && <EditPasswordDialog
        open={editDialogOpen}
        onEdit={() => loadItems()}
        onClose={() => setEditDialogOpen(false)}
        itemId={selectedItemId}
      />}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Password</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-gray-700">
            Are you sure you want to delete this password? This action cannot be undone.
          </p>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteItem}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
