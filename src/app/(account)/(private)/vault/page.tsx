'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
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
    <>
        {error && (
          <Alert severity="error" className="mb-4" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} className="p-6">
          <Box className="flex justify-between items-center mb-4">
            <Typography variant="h5" component="h1">
              Password Vault
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Password
            </Button>
          </Box>

          <Box className="flex flex-col sm:flex-row gap-3 mb-4">
            <FormControl size="small" fullWidth>
              <InputLabel>Filter</InputLabel>
              <Select
                label="Filter"
                value={filterType}
                onChange={(e) => {
                  const nextType = e.target.value as 'all' | 'normal' | 'long';
                  setFilterType(nextType);
                  setPage(1);
                  loadItems(1, nextType, sortDir);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="long">Long</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Order (by date)</InputLabel>
              <Select
                label="Order (by date)"
                value={sortDir}
                onChange={(e) => {
                  const nextDir = (e.target.value as string).toUpperCase() as 'ASC' | 'DESC';
                  setSortDir(nextDir);
                  setPage(1);
                  loadItems(1, filterType, nextDir);
                }}
              >
                <MenuItem value="DESC">Newest first</MenuItem>
                <MenuItem value="ASC">Oldest first</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : items.length === 0 ? (
            <Box className="text-center py-8">
              <Typography variant="h6" color="textSecondary">
                No passwords saved yet
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                Click &quot;Add Password&quot; to create your first entry
              </Typography>
            </Box>
          ) : (
            <>
              <List>
                {items.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemIcon>
                      {item.isLong ? <PageIcon /> : <PasswordIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      secondary={`Password: •••••••• • ${new Date(item.createdAt).toLocaleDateString()}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleViewItem(item.id)} className="mr-2" aria-label="view details">
                        <ViewIcon />
                      </IconButton>
                      <IconButton onClick={() => handleEditItem(item.id)} className="mr-2" aria-label="update details">
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setItemToDelete(item.id);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>

              {totalPages > 1 && (
                <Box className="flex justify-center mt-4">
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, newPage) => {
                      setPage(newPage);
                      loadItems(newPage);
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

      <AddPasswordDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={() => loadItems()} // Refresh list after adding
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
        <DialogTitle>Delete Password</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this password? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteItem} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
