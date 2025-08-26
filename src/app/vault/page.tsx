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
  AppBar,
  Toolbar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon, // added
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  Password as PasswordIcon, // added
  Description as PageIcon,  // added
} from '@mui/icons-material';
import { Toaster, toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vault as vaultApi, auth } from '@/lib/api';
import { encryptField, decryptField, initSodium } from '@/lib/crypto';
import sodium from 'libsodium-wrappers-sumo';
import AddPasswordDialog from './components/AddPasswordDialog';
import ViewPasswordDialog from './components/ViewPasswordDialog';

interface VaultItem {
  id: string;
  titleNonce: string;
  titleCiphertext: string;
  passwordNonce?: string;
  passwordCiphertext?: string;
  createdAt: string;
  isLong?: boolean;
}

interface DecryptedVaultItem extends VaultItem {
  title: string;
}

interface DecryptedItem {
  id: string;
  title: string;
  password: string;
  createdAt: string;
  isLong?: boolean;
}

// Add back base64 fix + compat decrypt for legacy/url-safe records
const fixBase64 = (s: string) => {
  if (!s) return s;
  let t = s.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  const pad = t.length % 4;
  if (pad) t += '='.repeat(4 - pad);
  return t;
};

const b64ToBytes = (s: string) => {
  const t = fixBase64(s);
  const bin = atob(t);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
};

const decryptCompat = async (nonceB64: string, ciphertextB64: string, key: Uint8Array) => {
  await initSodium();
  const n = b64ToBytes(nonceB64);
  const c = b64ToBytes(ciphertextB64);
  try {
    const msg1 = sodium.crypto_secretbox_open_easy(c, n, key);
    return new TextDecoder().decode(msg1);
  } catch {
    const msg2 = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, c, null, n, key);
    return new TextDecoder().decode(msg2);
  }
};

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<DecryptedItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'normal' | 'long'>('all');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    if (!isUnlocked) {
      console.warn('[vault] Not unlocked; redirecting to login');
      setLoading(false);
      setItems([]);
      setSelectedItem(null);
      setAddDialogOpen(false);
      setViewDialogOpen(false);
      setDeleteDialogOpen(false);
      wipeVaultKey();
      toast.info('Session expired. Please log in again.');
      router.replace('/login');
      return;
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
      console.error('[vault] Missing/invalid vaultKey. length=', vaultKey?.length);
      setItems([]);
      setSelectedItem(null);
      setAddDialogOpen(false);
      setViewDialogOpen(false);
      setDeleteDialogOpen(false);
      toast.info('Session expired. Please log in again.');
      wipeVaultKey();
      router.replace('/login');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await initSodium();
      console.debug('[vault] initSodium done. Fetching items page=', page);

      const typeToUse = overrideType ?? filterType;
      const sortDirToUse = overrideSortDir ?? sortDir;

      const response = await (vaultApi.getItems as any)(
        `${page}&type=${encodeURIComponent(typeToUse)}&sortDir=${encodeURIComponent(sortDirToUse)}`
      );
      console.debug('[vault] api.getItems ok:', {
        page: response.page,
        count: response.items?.length,
        total: response.total,
        type: typeToUse,
        sortDir: sortDirToUse,
      });

      const decryptedItems = await Promise.all(
        response.items.map(async (item: VaultItem, idx: number) => {
          try {
            const title = await decryptField(item.titleNonce, item.titleCiphertext, vaultKey);
            return { ...item, title };
          } catch (e: any) {
            // Fallback to compat decryption for older/url-safe entries
            const title = await decryptCompat(item.titleNonce, item.titleCiphertext, vaultKey);
            return { ...item, title };
          }
        })
      );

      setItems(decryptedItems);
      setTotalPages(Math.ceil(response.total / 10));
      setError('');
    } catch (err: any) {
      console.error('Failed to load vault items:', err);
      if (err?.status === 401 || err?.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        wipeVaultKey();
        router.replace('/login');
        return;
      }
      setError(err?.message || 'Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (title: string, password: string, longMode: boolean) => {
    if (!title || !password || !vaultKey) {
      console.warn('[vault] handleAddItem missing fields/key', { titleLen: title.length, passwordLen: password.length, vaultKeyLen: vaultKey?.length });
      return;
    }

    try {
      await initSodium();
      const titleEncrypted = await encryptField(title, vaultKey);
      const passwordEncrypted = await encryptField(password, vaultKey);

      await vaultApi.createItem({
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong: longMode,
      } as any);

      setAddDialogOpen(false);
      toast.success('Password added');
      loadItems();
    } catch (err: any) {
      console.error('Failed to add item:', err);
      if (err?.status === 401 || err?.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        wipeVaultKey();
        router.replace('/login');
        return;
      }
      setError(err?.message || 'Failed to add item');
      toast.error('Failed to add item');
    }
  };

  const handleViewItem = async (itemId: string) => {
    if (!vaultKey || vaultKey.length !== 32) {
      console.error('[vault] View missing/invalid key. length=', vaultKey?.length);
      setSelectedItem(null);
      setViewDialogOpen(false);
      toast.info('Session expired. Please log in again.');
      wipeVaultKey();
      router.replace('/login');
      return;
    }

    try {
      await initSodium();
      const item = await vaultApi.getItem(itemId);
      try {
        const decryptedItem: DecryptedItem = {
          id: item.id,
          title: await decryptField(item.titleNonce, item.titleCiphertext, vaultKey),
          password: await decryptField(item.passwordNonce!, item.passwordCiphertext!, vaultKey),
          isLong: item.isLong,
          createdAt: item.createdAt,
        };
        setSelectedItem(decryptedItem);
      } catch {
        // Fallback to compat for view
        const decryptedItem: DecryptedItem = {
          id: item.id,
          title: await decryptCompat(item.titleNonce, item.titleCiphertext, vaultKey),
          password: await decryptCompat(item.passwordNonce!, item.passwordCiphertext!, vaultKey),
          isLong: item.isLong,
          createdAt: item.createdAt,
        };
        setSelectedItem(decryptedItem);
      }
      setViewDialogOpen(true);
    } catch (err: any) {
      console.error('Failed to load item:', err);
      if (err?.status === 401 || err?.response?.status === 401) {
        toast.info('Session expired. Please log in again.');
        wipeVaultKey();
        router.replace('/login');
        return;
      }
      setError(err?.message || 'Failed to load item');
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await vaultApi.deleteItem(itemToDelete);
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

  const handleLogout = async () => {
    try {
      await auth.logout();
      wipeVaultKey();
      toast.success('Logged out');
      router.push('/');
    } catch (err) {
      wipeVaultKey();
      toast.success('Logged out');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="static">
        <Toolbar>
          <LockIcon className="mr-2" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            LockPulse Vault
          </Typography>
          <Chip
            label="Unlocked"
            color="success"
            variant="filled"
            sx={{ color: '#fff', fontWeight: 600 }}
            className="mr-4"
          />
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Toaster position="top-center" duration={1500} richColors />

      <Container maxWidth="md" className="py-8">
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
      </Container>

      <AddPasswordDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdd={handleAddItem}
      />

      <ViewPasswordDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        item={selectedItem}
      />

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
    </div>
  );
}
