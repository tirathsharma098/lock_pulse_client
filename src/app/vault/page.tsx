'use client';

import { useState, useEffect, useRef } from 'react';
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
  TextField,
  Alert,
  Box,
  Pagination,
  Fab,
  AppBar,
  Toolbar,
  Chip,
  InputAdornment,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Lock as LockIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { Toaster, toast } from 'sonner';
import { useVault } from '@/contexts/VaultContext';
import { vault as vaultApi, auth } from '@/lib/api';
import { encryptField, decryptField, initSodium } from '@/lib/crypto';
import sodium from 'libsodium-wrappers-sumo';

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

function utf8BytesLen(s: string) {
  return new TextEncoder().encode(s).length;
}

export default function VaultPage() {
  const { vaultKey, isUnlocked, wipeVaultKey } = useVault();
  const router = useRouter();
  const [items, setItems] = useState<DecryptedVaultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedItem, setSelectedItem] = useState<DecryptedItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<number | null>(null);

  const [longMode, setLongMode] = useState(false);
  const [passwordBytes, setPasswordBytes] = useState(0);
  const [passwordTooLong, setPasswordTooLong] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<'all' | 'normal' | 'long'>('all');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('DESC');

  useEffect(() => {
    // cleanup any pending timer on unmount
    return () => {
      if (copyResetRef.current) {
        window.clearTimeout(copyResetRef.current);
      }
    };
  }, []);

  // Normalize base64 to standard alphabet and apply padding
  const fixBase64 = (s: string) => {
    if (!s) return s;
    let t = s.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    const pad = t.length % 4;
    if (pad) t += '='.repeat(4 - pad);
    return t;
  };

  // Decode base64 (standard or url-safe) to bytes using atob
  const b64ToBytes = (s: string) => {
    const t = fixBase64(s);
    const bin = atob(t);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  // Fallback decrypt: try secretbox first, then AEAD XChaCha20-Poly1305
  const decryptCompat = async (nonceB64: string, ciphertextB64: string, key: Uint8Array) => {
    await initSodium();
    const n = b64ToBytes(nonceB64);
    const c = b64ToBytes(ciphertextB64);
    console.debug('[vault] decryptCompat bytes:', { nLen: n.length, cLen: c.length, kLen: key.length });
    try {
      const msg = sodium.crypto_secretbox_open_easy(c, n, key);
      const text = new TextDecoder().decode(msg);
      console.debug('[vault] decryptCompat secretbox_open_easy ok, msgLen=', text.length);
      return text;
    } catch (e1: any) {
      console.warn('[vault] secretbox_open_easy failed:', e1?.message);
      try {
        const msg = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(null, c, null, n, key);
        const text = new TextDecoder().decode(msg);
        console.debug('[vault] decryptCompat aead_xchacha20poly1305_ietf ok, msgLen=', text.length);
        return text;
      } catch (e2: any) {
        console.error('[vault] decryptCompat aead failed:', e2?.message);
        throw new Error(e2?.message || e1?.message || 'decryptCompat failed');
      }
    }
  };

  const isUrlSafe = (s: string) => /[-_]/.test(s);
  const decodedLen = (label: string, s: string) => {
    try {
      const t = fixBase64(s);
      const len = typeof atob === 'function' ? atob(t).length : -1;
      console.debug(`[vault] decodedLen(${label}) ok:`, len);
      return len;
    } catch (e) {
      console.warn(`[vault] decodedLen(${label}) failed`, e);
      return -1;
    }
  };

  useEffect(() => {
    if (!isUnlocked) {
      console.warn('[vault] Not unlocked; skipping load');
      setLoading(false);
      return;
    }
    console.debug('[vault] useEffect loadItems page=', page, 'isUnlocked=', isUnlocked, 'vaultKeyLen=', vaultKey?.length);
    loadItems(page); // pass current page to avoid always loading page 1
  }, [isUnlocked, page]);

  // Accept optional override filter/sort to avoid stale state during onChange
  const loadItems = async (
    page: number = 1,
    overrideType?: 'all' | 'normal' | 'long',
    overrideSortDir?: 'ASC' | 'DESC'
  ) => {
    if (!vaultKey || vaultKey.length !== 32) {
      console.error('[vault] Missing/invalid vaultKey. length=', vaultKey?.length);
      setError('Vault key missing or invalid. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      await initSodium();
      console.debug('[vault] initSodium done. Fetching items page=', page);

      const typeToUse = overrideType ?? filterType;
      const sortDirToUse = overrideSortDir ?? sortDir;

      // Request server-side pagination + filtering + sorting
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
          console.debug('[vault] item pre-decrypt:', {
            idx,
            id: item.id,
            titleNonceLen: item.titleNonce?.length,
            titleCipherLen: item.titleCiphertext?.length,
          });
          decodedLen('titleNonce', item.titleNonce);
          decodedLen('titleCiphertext', item.titleCiphertext);

          try {
            const title = await decryptField(item.titleNonce, item.titleCiphertext, vaultKey);
            console.debug('[vault] title decrypted:', { id: item.id, titleLen: title.length });
            return { ...item, title };
          } catch (e: any) {
            console.warn('[vault] title decrypt failed (raw), trying compat:', { id: item.id, error: e?.message });
            const title = await decryptCompat(item.titleNonce, item.titleCiphertext, vaultKey);
            console.debug('[vault] title decrypted (compat):', { id: item.id, titleLen: title.length });
            return { ...item, title };
          }
        })
      );

      // Do not filter/sort on client; server already did it
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

  const handleAddItem = async () => {
    if (!newTitle || !newPassword || !vaultKey) {
      console.warn('[vault] handleAddItem missing fields/key', { newTitleLen: newTitle.length, newPasswordLen: newPassword.length, vaultKeyLen: vaultKey?.length });
      return;
    }

    const bytes = utf8BytesLen(newPassword);
    setPasswordBytes(bytes);

    if (!longMode && bytes > 1024) {
      setPasswordTooLong('Normal password max is 1KB. Switch to Long secret to continue.');
      return;
    }
    if (bytes > 20 * 1024) {
      setPasswordTooLong('Password max is 20KB.');
      return;
    }
    setPasswordTooLong(null);

    try {
      await initSodium();
      console.debug('[vault] Adding item...');

      const titleEncrypted = await encryptField(newTitle, vaultKey);
      const passwordEncrypted = await encryptField(newPassword, vaultKey);

      console.debug('[vault] Encrypted new item:', {
        titleNonceLen: titleEncrypted.nonce.length,
        titleCipherLen: titleEncrypted.ciphertext.length,
        passNonceLen: passwordEncrypted.nonce.length,
        passCipherLen: passwordEncrypted.ciphertext.length,
        titleNonceUrlSafe: isUrlSafe(titleEncrypted.nonce),
        passNonceUrlSafe: isUrlSafe(passwordEncrypted.nonce),
      });

      const res = await vaultApi.createItem({
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
        isLong: longMode, // send user’s choice to backend
      } as any);
      console.debug('[vault] createItem response:', res);

      setNewTitle('');
      setNewPassword('');
      setPasswordBytes(0);
      setPasswordTooLong(null);
      setLongMode(false);
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
      setError('Vault key missing or invalid. Please log in again.');
      return;
    }

    try {
      await initSodium();
      console.debug('[vault] Fetching item:', itemId);

      const item = await vaultApi.getItem(itemId);
      console.debug('[vault] getItem ok:', {
        id: item.id,
        titleNonceLen: item.titleNonce?.length,
        titleCipherLen: item.titleCiphertext?.length,
        passNonceLen: item.passwordNonce?.length,
        passCipherLen: item.passwordCiphertext?.length,
        titleNonceUrlSafe: isUrlSafe(item.titleNonce),
        passNonceUrlSafe: isUrlSafe(item.passwordNonce),
      });
      decodedLen('titleNonce', item.titleNonce);
      decodedLen('titleCiphertext', item.titleCiphertext);
      decodedLen('passwordNonce', item.passwordNonce);
      decodedLen('passwordCiphertext', item.passwordCiphertext);

      try {
        const decryptedItem: DecryptedItem = {
          id: item.id,
          title: await decryptField(item.titleNonce, item.titleCiphertext, vaultKey),
          password: await decryptField(item.passwordNonce!, item.passwordCiphertext!, vaultKey),
          isLong: item.isLong,
          createdAt: item.createdAt,
        };
        console.debug('[vault] view decrypt (no-fix) ok:', { id: item.id });
        setSelectedItem(decryptedItem);
      } catch (e: any) {
        console.warn('[vault] view decrypt failed (raw), trying compat:', { id: item.id, error: e?.message });
        const decryptedItem: DecryptedItem = {
          id: item.id,
          title: await decryptCompat(item.titleNonce, item.titleCiphertext, vaultKey),
          password: await decryptCompat(item.passwordNonce!, item.passwordCiphertext!, vaultKey),
          isLong: item.isLong,
          createdAt: item.createdAt,
        };
        console.debug('[vault] view decrypt (compat) ok:', { id: item.id });
        setSelectedItem(decryptedItem);
      }

      setShowPassword(false);
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard', { duration: 1500 });
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Copy failed', { duration: 1500 });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppBar position="static">
          <Toolbar>
            <LockIcon className="mr-2" />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              LockPulse Vault
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" className="py-16">
          {error && (
            <Alert severity="error" className="mb-4" onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          <Paper elevation={2} className="p-6 text-center">
            <Typography variant="h6" className="mb-2">
              Vault is locked
            </Typography>
            <Typography variant="body2" color="textSecondary" className="mb-4">
              Please log in to unlock your vault.
            </Typography>
            <Button variant="contained" onClick={() => router.replace('/login')}>
              Go to Login
            </Button>
          </Paper>
        </Container>
      </div>
    );
  }

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
                  loadItems(1, nextType, sortDir); // pass next filter explicitly
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
                  loadItems(1, filterType, nextDir); // pass next sort explicitly
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
                      loadItems(newPage); // page change uses current state
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>
      </Container>

      {/* Add Password Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Password</DialogTitle>
        <DialogContent className="space-y-2">
          <FormControlLabel
            control={
              <Switch
                checked={longMode}
                onChange={(_, checked) => {
                  setLongMode(checked);
                  const bytes = utf8BytesLen(newPassword);
                  setPasswordBytes(bytes);
                  if (!checked && bytes > 1024) {
                    setPasswordTooLong('Normal password max is 1KB. Switch to Long secret to continue.');
                  } else if (checked && bytes > 20 * 1024) {
                    setPasswordTooLong('Password max is 20KB.');
                  } else {
                    setPasswordTooLong(null);
                  }
                }}
              />
            }
            label="Long secret (multi-line, up to 20KB)"
          />
          {/* Title label */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Title</Typography>
          <TextField
            fullWidth
            // label removed for consistency with custom label above
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
          {/* Password label */}
          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            Password {longMode ? '(up to 20KB)' : '(up to 1KB)'}
          </Typography>
          <TextField
            fullWidth
            // label removed for consistency
            type={longMode ? 'text' : 'password'}
            multiline={longMode}
            minRows={longMode ? 8 : undefined}
            value={newPassword}
            onChange={(e) => {
              const v = e.target.value;
              setNewPassword(v);
              const bytes = utf8BytesLen(v);
              setPasswordBytes(bytes);
              if (!longMode && bytes > 1024) {
                setPasswordTooLong('Normal password max is 1KB. Switch to Long secret to continue.');
              } else if (bytes > 20 * 1024) {
                setPasswordTooLong('Password max is 20KB.');
              } else {
                setPasswordTooLong(null);
              }
            }}
            margin="normal"
            error={!!passwordTooLong}
            helperText={
              passwordTooLong
                ? passwordTooLong
                : `Size: ${passwordBytes} / ${longMode ? 20480 : 1024} bytes`
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained" disabled={!!passwordTooLong}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Password Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Password Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <div className="space-y-2">
              {/* Title label */}
              <Typography variant="subtitle2">Title</Typography>
              <TextField
                fullWidth
                // label removed
                value={selectedItem.title}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              {(() => {
                const isMulti = !!selectedItem.isLong;
                return (
                  <>
                    {/* Password label with copy button beside label */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2">Password</Typography>
                      <IconButton
                        aria-label="copy password"
                        onClick={() => copyToClipboard(selectedItem.password)}
                        size="small"
                        color={copied ? 'success' : 'default'}
                      >
                        {copied ? <CheckIcon /> : <CopyIcon />}
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      // label removed
                      type={!isMulti ? (showPassword ? 'text' : 'password') : 'text'}
                      multiline={isMulti}
                      minRows={isMulti ? 10 : undefined}
                      value={selectedItem.password}
                      InputProps={{
                        readOnly: true,
                        // remove copy icon from adornments; keep only show/hide for single-line
                        endAdornment: !isMulti ? (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={showPassword ? 'hide password' : 'show password'}
                              onClick={() => setShowPassword((v) => !v)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <ViewIcon />}
                            </IconButton>
                          </InputAdornment>
                        ) : undefined,
                      }}
                      margin="normal"
                    />
                  </>
                );
              })()}
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Created: {new Date(selectedItem.createdAt).toLocaleString()}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
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
