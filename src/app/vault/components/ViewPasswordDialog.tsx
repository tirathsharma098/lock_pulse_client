'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Box, IconButton, InputAdornment
} from '@mui/material';
import {
  Visibility as ViewIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'sonner';

type DecryptedItem = {
  id: string;
  title: string;
  password: string;
  createdAt: string;
  isLong?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  item: DecryptedItem | null;
};

export default function ViewPasswordDialog({ open, onClose, item }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
    };
  }, []);

  useEffect(() => {
    // reset states when dialog re-opens for a different item
    if (open) {
      setShowPassword(false);
      setCopied(false);
    }
  }, [open, item?.id]);

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Password Details</DialogTitle>
      <DialogContent>
        {item && (
          <div className="space-y-2">
            <Typography variant="subtitle2">Title</Typography>
            <TextField
              fullWidth
              value={item.title}
              InputProps={{ readOnly: true }}
              margin="normal"
            />
            {(() => {
              const isMulti = !!item.isLong;
              return (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="subtitle2">Password</Typography>
                    <IconButton
                      aria-label="copy password"
                      onClick={() => copyToClipboard(item.password)}
                      size="small"
                      color={copied ? 'success' : 'default'}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                  </Box>
                  <TextField
                    fullWidth
                    type={!isMulti ? (showPassword ? 'text' : 'password') : 'text'}
                    multiline={isMulti}
                    minRows={isMulti ? 10 : undefined}
                    value={item.password}
                    InputProps={{
                      readOnly: true,
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
              Created: {new Date(item.createdAt).toLocaleString()}
            </Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
