'use client';

import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, FormControlLabel, Switch
} from '@mui/material';

function utf8BytesLen(s: string) {
  return new TextEncoder().encode(s).length;
}

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string, password: string, longMode: boolean) => void | Promise<void>;
};

export default function AddPasswordDialog({ open, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [longMode, setLongMode] = useState(false);
  const [passwordBytes, setPasswordBytes] = useState(0);
  const [passwordTooLong, setPasswordTooLong] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLenCheck = (text: string, isLong: boolean) => {
    const bytes = utf8BytesLen(text);
    setPasswordBytes(bytes);
    if (!isLong && bytes > 1024) {
      setPasswordTooLong('Normal password max is 1KB. Switch to Long secret to continue.');
    } else if (bytes > 20 * 1024) {
      setPasswordTooLong('Password max is 20KB.');
    } else {
      setPasswordTooLong(null);
    }
  };

  const handleToggleLong = (_: any, checked: boolean) => {
    setLongMode(checked);
    handleLenCheck(password, checked);
  };

  const handlePasswordChange = (v: string) => {
    setPassword(v);
    handleLenCheck(v, longMode);
  };

  const resetAndClose = () => {
    setTitle('');
    setPassword('');
    setPasswordBytes(0);
    setPasswordTooLong(null);
    setLongMode(false);
    onClose();
  };

  const handleAddClick = async () => {
    if (!title || !password || passwordTooLong) return;
    try {
      setSubmitting(true);
      await onAdd(title, password, longMode);
      resetAndClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Password</DialogTitle>
      <DialogContent className="space-y-2">
        <FormControlLabel
          control={<Switch checked={longMode} onChange={handleToggleLong} />}
          label="Long secret (multi-line, up to 20KB)"
        />

        <Typography variant="subtitle2" sx={{ mt: 1 }}>Title</Typography>
        <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          Password {longMode ? '(up to 20KB)' : '(up to 1KB)'}
        </Typography>
        <TextField
          fullWidth
          type={longMode ? 'text' : 'password'}
          multiline={longMode}
          minRows={longMode ? 8 : undefined}
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
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
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          onClick={handleAddClick}
          variant="contained"
          disabled={!!passwordTooLong || !title || !password || submitting}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
