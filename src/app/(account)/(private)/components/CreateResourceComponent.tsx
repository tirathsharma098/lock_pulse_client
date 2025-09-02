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

export interface CreateFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'password' | 'textarea';
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  placeholder?: string;
  showToggleVisibility?: boolean;
}

export interface CreateResourceComponentProps {
  title: string;
  fields: CreateFieldConfig[];
  values: Record<string, any>;
  errors: Record<string, string>;
  loading: boolean;
  showLongMode?: boolean;
  longMode?: boolean;
  onValueChange: (fieldName: string, value: any) => void;
  onLongModeChange?: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  submitButtonText?: string;
  longModeLabel?: string;
}

export default function CreateResourceComponent({
  title,
  fields,
  values,
  errors,
  loading,
  showLongMode = false,
  longMode = false,
  onValueChange,
  onLongModeChange,
  onSubmit,
  onBack,
  submitButtonText = 'Create',
  longModeLabel = 'Long text mode',
}: CreateResourceComponentProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleTogglePasswordVisibility = (fieldName: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

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
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the form errors
            </Alert>
          )}
          
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Creating...' : submitButtonText}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}