'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

export interface ViewFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'textarea' | 'datetime';
  multiline?: boolean;
  rows?: number;
  copyable?: boolean;
  showToggleVisibility?: boolean;
  format?: (value: any) => string;
}

export interface ViewResourceComponentProps {
  title: string;
  fields: ViewFieldConfig[];
  data: Record<string, any>;
  loading: boolean;
  error?: string | null;
  onBack: () => void;
  onEdit?: () => void;
  editButtonText?: string;
  children?: React.ReactNode; // For custom sections like services list
}

export default function ViewResourceComponent({
  title,
  fields,
  data,
  loading,
  error,
  onBack,
  onEdit,
  editButtonText = 'Edit',
  children,
}: ViewResourceComponentProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleTogglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleCopyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage(`${label} copied to clipboard`);
      setSnackbarOpen(true);
    } catch (err) {
      console.error(`Failed to copy ${label}:`, err);
      setSnackbarMessage(`Failed to copy ${label}`);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={onBack}
          >
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!Object.keys(data).length) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Resource not found</Alert>
        <Box mt={2}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={onBack}
          >
            Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBack}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {onEdit && (
          <Button 
            variant="outlined" 
            startIcon={<EditIcon />} 
            onClick={onEdit}
          >
            {editButtonText}
          </Button>
        )}
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: children ? 3 : 0 }}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {fields.map((field) => {
          const fieldValue = data[field.name];
          const isPassword = field.type === 'password';
          const showPassword = showPasswords[field.name] || false;
          const isMultiline = field.multiline;
          
          if (fieldValue === undefined || fieldValue === null) {
            return null;
          }

          const displayValue = field.format 
            ? field.format(fieldValue)
            : fieldValue;

          return (
            <Box key={field.name} mb={2}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {field.label}
              </Typography>
              
              {isPassword ? (
                <TextField
                  value={showPassword ? displayValue : '••••••••••••'}
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline={isMultiline}
                  rows={isMultiline ? (field.rows || 4) : 1}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        {field.showToggleVisibility && (
                          <IconButton
                            onClick={() => handleTogglePasswordVisibility(field.name)}
                            edge="end"
                            title={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        )}
                        {field.copyable && (
                          <IconButton
                            onClick={() => handleCopyToClipboard(fieldValue, field.label)}
                            edge="end"
                            title={`Copy ${field.label}`}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              ) : isMultiline ? (
                <TextField
                  value={displayValue}
                  variant="outlined"
                  size="small"
                  fullWidth
                  multiline
                  rows={field.rows || 4}
                  InputProps={{
                    readOnly: true,
                    endAdornment: field.copyable ? (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleCopyToClipboard(fieldValue, field.label)}
                          edge="end"
                          title={`Copy ${field.label}`}
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </InputAdornment>
                    ) : undefined,
                  }}
                />
              ) : (
                <Box display="flex" alignItems="center">
                  <Typography sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
                    {displayValue}
                  </Typography>
                  {field.copyable && (
                    <IconButton
                      onClick={() => handleCopyToClipboard(fieldValue, field.label)}
                      title={`Copy ${field.label}`}
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>

      {children}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
}