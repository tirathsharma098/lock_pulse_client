# Global Resource Components

This implementation creates reusable CRUD (Create, Read, Update, Delete) components for the Lock Pulse application to reduce code duplication across Project, Service, and Credential management pages.

## Components Created

### 1. CreateResourceComponent
- **Path**: `src/app/(account)/(private)/components/CreateResourceComponent.tsx`
- **Purpose**: Handles creation forms for any resource type
- **Features**:
  - Dynamic field configuration via props
  - Password visibility toggle
  - Long mode support for text areas
  - Form validation display
  - Loading states

### 2. EditResourceComponent  
- **Path**: `src/app/(account)/(private)/components/EditResourceComponent.tsx`
- **Purpose**: Handles editing forms for any resource type
- **Features**:
  - Pre-filled form values
  - Same dynamic field configuration as create
  - Loading and saving states
  - Error handling

### 3. ViewResourceComponent
- **Path**: `src/app/(account)/(private)/components/ViewResourceComponent.tsx`
- **Purpose**: Displays resource details in read-only format
- **Features**:
  - Password masking with show/hide toggle
  - Copy to clipboard functionality
  - Custom field formatting
  - Support for custom content sections (like Services list)

## Usage Example

```typescript
// In a project create page
import { CreateResourceComponent, CreateFieldConfig } from '../../components';

const fields: CreateFieldConfig[] = [
  {
    name: 'name',
    label: 'Project Name',
    type: 'text',
    required: true
  },
  {
    name: 'password', 
    label: 'Project Password',
    type: 'password',
    showToggleVisibility: true
  }
];

<CreateResourceComponent
  title="Create New Project"
  fields={fields}
  values={values}
  errors={errors}
  loading={loading}
  onValueChange={handleValueChange}
  onSubmit={handleSubmit}
  onBack={handleBack}
/>
```

## Updated Pages

- **Project Create**: `/project/[projectId]/create/page.tsx` - Now uses CreateResourceComponent
- **Project Edit**: `/project/[projectId]/edit/page.tsx` - Now uses EditResourceComponent  
- **Project View**: `/project/[projectId]/view/page.tsx` - Now uses ViewResourceComponent

## Benefits

1. **Code Reuse**: Eliminates duplicate UI logic across project/service/credential pages
2. **Consistency**: Ensures uniform behavior and styling across all CRUD operations
3. **Maintainability**: Changes to common patterns only need to be made in one place
4. **Separation of Concerns**: Crypto logic remains in individual pages while UI is abstracted
5. **Type Safety**: Full TypeScript support with proper interfaces

## Architecture

The components follow a pattern where:
- **Crypto logic** stays in the individual pages (encryption, decryption, key management)
- **UI logic** is abstracted into reusable components
- **Business logic** is passed via props (validation, submit handlers)
- **Field configuration** is declarative and flexible

This approach maintains the security-focused architecture while significantly reducing code duplication.