'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

export interface EditFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'textarea';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  placeholder?: string;
  showToggleVisibility?: boolean;
  readOnly?: boolean;
}

export interface EditResourceComponentProps {
  title: string;
  fields: EditFieldConfig[];
  values: Record<string, any>;
  errors: Record<string, string>;
  loading: boolean;
  saving: boolean;
  showLongMode?: boolean;
  longMode?: boolean;
  onValueChange: (fieldName: string, value: any) => void;
  onLongModeChange?: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitButtonText?: string;
  longModeLabel?: string;
  error?: string | null;
}

export default function EditResourceComponent({
  title,
  fields,
  values,
  errors,
  loading,
  saving,
  showLongMode = false,
  longMode = false,
  onValueChange,
  onLongModeChange,
  onSubmit,
  onBack,
  submitButtonText = 'Save Changes',
  longModeLabel = 'Long text mode',
  error,
}: EditResourceComponentProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleTogglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !Object.keys(values).length) {
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
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <form onSubmit={onSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {fields.map((field) => {
            const fieldValue = values[field.name] || '';
            const fieldError = errors[field.name];
            const isPassword = field.type === 'password';
            const showPassword = showPasswords[field.name] || false;
            const isMultiline = field.multiline || (longMode && field.type === 'password');
            
            return (
              <Box key={field.name} mb={3}>
                <TextField
                  label={field.label}
                  type={isPassword && !showPassword ? 'password' : 'text'}
                  value={fieldValue}
                  onChange={(e) => onValueChange(field.name, e.target.value)}
                  fullWidth
                  required={field.required}
                  variant="outlined"
                  multiline={isMultiline}
                  rows={isMultiline ? (field.rows || 4) : 1}
                  error={!!fieldError}
                  helperText={fieldError || field.helperText}
                  placeholder={field.placeholder}
                  disabled={field.readOnly}
                  InputProps={isPassword && field.showToggleVisibility ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility(field.name)}
                          edge="end"
                          title={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  } : undefined}
                />
              </Box>
            );
          })}

          {showLongMode && onLongModeChange && (
            <Box mb={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={longMode}
                    onChange={(e) => onLongModeChange(e.target.checked)}
                    color="primary"
                  />
                }
                label={longModeLabel}
              />
            </Box>
          )}
          
          <Box display="flex" gap={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={onBack}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SaveIcon />}
              disabled={saving}
            >
              {saving ? 'Saving...' : submitButtonText}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}