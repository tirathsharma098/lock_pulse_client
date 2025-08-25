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
  TextField,
  Alert,
  Box,
  Pagination,
  Fab,
  AppBar,
  Toolbar,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Logout as LogoutIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useVault } from '@/contexts/VaultContext';
import { vault as vaultApi, auth } from '@/lib/api';
import { encryptField, decryptField } from '@/lib/crypto';

interface VaultItem {
  id: string;
  titleNonce: string;
  titleCiphertext: string;
  createdAt: string;
}

interface DecryptedItem {
  id: string;
  title: string;
  password: string;
  createdAt: string;
}

export default function VaultPage() {
  const { vaultKey, isUnlocked, wipeVaultKey } = useVault();
  const router = useRouter();
  const [items, setItems] = useState<VaultItem[]>([]);
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

  useEffect(() => {
    if (!isUnlocked) {
      router.push('/unlock');
      return;
    }
    loadItems();
  }, [isUnlocked, page]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await vaultApi.getItems(page);
      
      const decryptedItems = response.items.map((item: any) => ({
        ...item,
        title: decryptField(item.titleNonce, item.titleCiphertext, vaultKey!),
      }));
      
      setItems(decryptedItems);
      setTotalPages(Math.ceil(response.total / 10));
      setError('');
    } catch (err: any) {
      setError('Failed to load vault items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newTitle || !newPassword) return;

    try {
      const titleEncrypted = encryptField(newTitle, vaultKey!);
      const passwordEncrypted = encryptField(newPassword, vaultKey!);

      await vaultApi.createItem({
        titleNonce: titleEncrypted.nonce,
        titleCiphertext: titleEncrypted.ciphertext,
        passwordNonce: passwordEncrypted.nonce,
        passwordCiphertext: passwordEncrypted.ciphertext,
      });

      setNewTitle('');
      setNewPassword('');
      setAddDialogOpen(false);
      loadItems();
    } catch (err: any) {
      setError('Failed to add item');
    }
  };

  const handleViewItem = async (itemId: string) => {
    try {
      const item = await vaultApi.getItem(itemId);
      const decryptedItem: DecryptedItem = {
        id: item.id,
        title: decryptField(item.titleNonce, item.titleCiphertext, vaultKey!),
        password: decryptField(item.passwordNonce, item.passwordCiphertext, vaultKey!),
        createdAt: item.createdAt,
      };
      
      setSelectedItem(decryptedItem);
      setViewDialogOpen(true);
    } catch (err: any) {
      setError('Failed to load item');
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      await vaultApi.deleteItem(itemToDelete);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadItems();
    } catch (err: any) {
      setError('Failed to delete item');
    }
  };

  const handleLogout = async () => {
    try {
      await auth.logout();
      wipeVaultKey();
      router.push('/');
    } catch (err) {
      // Even if logout fails, clear local state
      wipeVaultKey();
      router.push('/');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isUnlocked) {
    return null;
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
            variant="outlined" 
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

          {loading ? (
            <Typography>Loading...</Typography>
          ) : items.length === 0 ? (
            <Box className="text-center py-8">
              <Typography variant="h6" color="textSecondary">
                No passwords saved yet
              </Typography>
              <Typography variant="body2" color="textSecondary" className="mt-2">
                Click "Add Password" to create your first entry
              </Typography>
            </Box>
          ) : (
            <>
              <List>
                {items.map((item) => (
                  <ListItem key={item.id} divider>
                    <ListItemText
                      primary={item.title}
                      secondary={new Date(item.createdAt).toLocaleDateString()}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => handleViewItem(item.id)} className="mr-2">
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setItemToDelete(item.id);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
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
                    onChange={(_, newPage) => setPage(newPage)}
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
        <DialogContent className="space-y-4">
          <TextField
            fullWidth
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Password Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Password Details</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <div className="space-y-4">
              <TextField
                fullWidth
                label="Title"
                value={selectedItem.title}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                value={selectedItem.password}
                InputProps={{ 
                  readOnly: true,
                  endAdornment: (
                    <Button onClick={() => copyToClipboard(selectedItem.password)}>
                      Copy
                    </Button>
                  )
                }}
                margin="normal"
              />
              <Typography variant="body2" color="textSecondary">
                Created: {new Date(selectedItem.createdAt).toLocaleString()}
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
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
