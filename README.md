# 🔐 LockPulse Frontend - OPAQUE Password Manager Client

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![OPAQUE](https://img.shields.io/badge/OPAQUE-Protocol-green?style=for-the-badge)

## 🌟 Project Overview

LockPulse Frontend is a **passwordless authentication client** and **encrypted password manager** built with Next.js. It implements the OPAQUE protocol for secure authentication where your master password never leaves your device, and all vault data is encrypted client-side before reaching the server.

### 🎯 How It Works (Developer's Perspective)

The application follows a **two-phase authentication** system:
1. **Registration Phase** - Creates cryptographic proof without sending password
2. **Login Phase** - Proves identity without revealing password
3. **Vault Phase** - Encrypts/decrypts password items locally

## 🛠️ Technology Stack & Key Libraries

### Core Framework
- **Next.js 15.5** - App Router with server components
- **React 19.1** - Client components with hooks
- **TypeScript** - Type safety throughout

### Cryptography & Security
- **@serenity-kit/opaque** - OPAQUE protocol implementation
- **libsodium-wrappers-sumo** - Client-side encryption (ChaCha20Poly1305)

### UI & Styling
- **@mui/material 6.1.6** - Material Design components
- **@mui/icons-material** - Icon library
- **lucide-react** - Additional icons
- **clsx** - Conditional CSS classes
- **next-themes** - Dark/light theme switching

### Notifications & UX
- **sonner** - Toast notifications for user feedback

## 🔄 Authentication Flow - Step by Step

### 📋 Registration Process

#### Step 1: User Enters Credentials
```typescript
// User fills registration form
const masterPassword = "user_entered_password"
const username = "user@example.com"
```

#### Step 2: Generate Registration Request
```typescript
// From @serenity-kit/opaque package
import { client } from '@serenity-kit/opaque'

// Creates cryptographic registration request (no password sent)
const registrationStartResult = client.startRegistration({
  password: masterPassword
})

// registrationStartResult contains:
// - registrationRequest: base64 string (cryptographic commitment)
// - clientRegistrationState: temporary client state
```

#### Step 3: Send Registration Request to Backend
```typescript
// From our API library (src/lib/api.ts)
import { auth } from '@/lib/api'

const response = await auth.registerStart({
  username: username,
  registrationRequest: registrationStartResult.registrationRequest
})

// Backend processes with OpaqueService.createRegistrationResponse()
// Returns: { registrationResponse: "base64_string" }
```

#### Step 4: Complete Registration Locally
```typescript
// Using @serenity-kit/opaque again
const registrationFinishResult = client.finishRegistration({
  clientRegistrationState: registrationStartResult.clientRegistrationState,
  registrationResponse: response.registrationResponse,
  password: masterPassword
})

// registrationFinishResult contains:
// - registrationRecord: proof that user knows password (stored on server)
// - exportKey: master key for encrypting vault data
```

#### Step 5: Generate Vault Encryption Key
```typescript
// Using libsodium-wrappers-sumo for client-side encryption
import sodium from 'libsodium-wrappers-sumo'

// Generate random vault key for encrypting password items
const vaultKey = sodium.randombytes_buf(32) // 32-byte key

// Derive key-wrapping key from OPAQUE export key
const keyWrappingKey = sodium.crypto_kdf_derive_from_key(
  32, 1, 'vaultkey', registrationFinishResult.exportKey
)

// Encrypt vault key with wrapping key (vault key never stored plaintext)
const wrappedVaultKey = sodium.crypto_secretbox_easy(vaultKey, nonce, keyWrappingKey)

// Generate salt for additional security
const vaultKdfSalt = sodium.randombytes_buf(16)
```

#### Step 6: Send Final Registration Data
```typescript
await auth.registerFinish({
  username: username,
  registrationRecord: registrationFinishResult.registrationRecord,
  wrappedVaultKey: sodium.to_base64(wrappedVaultKey),
  vaultKdfSalt: sodium.to_base64(vaultKdfSalt),
  vaultKdfParams: { iterations: 100000, keySize: 32 }
})

// Backend stores in database:
// - OPAQUE registrationRecord (for future authentication)
// - wrappedVaultKey (encrypted, can't be decrypted without user password)
// - KDF parameters for vault key derivation
```

### 🔐 Login Process

#### Step 1: Start Login Request
```typescript
// User enters credentials
const masterPassword = "user_entered_password"
const username = "user@example.com"

// Generate login request using @serenity-kit/opaque
const loginStartResult = client.startLogin({
  password: masterPassword
})

// loginStartResult contains:
// - startLoginRequest: cryptographic challenge (no password data)
// - clientLoginState: temporary state for this login session
```

#### Step 2: Backend Processes Login Start
```typescript
// Frontend sends to backend
const loginStartResponse = await auth.loginStart({
  username: username,
  startLoginRequest: loginStartResult.startLoginRequest
})

// Backend (AuthController.loginStart()):
// 1. Finds user by username
// 2. Uses OpaqueService.startLogin() with stored registrationRecord
// 3. Generates unique loginId (prevents session mixing)
// 4. Stores login session in Redis cache with 60-second expiry
// 5. Returns: { loginResponse: "crypto_data", loginId: "unique_session_id" }
```

**🔍 How Backend Knows It's Same User:**
- Backend doesn't "know" it's the same user yet
- `loginId` is a random session identifier stored in Redis
- Actual verification happens in Step 4

#### Step 3: Complete Login Proof
```typescript
// Using loginStartResponse from backend
const loginFinishResult = client.finishLogin({
  clientLoginState: loginStartResult.clientLoginState,
  loginResponse: loginStartResponse.loginResponse,
  password: masterPassword
})

// loginFinishResult contains:
// - finishLoginRequest: cryptographic proof of password knowledge
// - exportKey: master key (same as registration if password correct)
```

#### Step 4: Backend Verifies Proof
```typescript
// Frontend sends final proof
await auth.loginFinish({
  loginId: loginStartResponse.loginId, // Links to cached session
  finishLoginRequest: loginFinishResult.finishLoginRequest
})

// Backend (AuthController.loginFinish()):
// 1. Retrieves session from Redis using loginId
// 2. Uses OpaqueService.finishLogin() to verify proof
// 3. If valid: generates JWT token, sets httpOnly cookie
// 4. Cleans up login session from Redis
// 5. Returns: { ok: true }
```

**🔍 Backend Verification Process:**
- Redis session links `loginId` to specific user and crypto state
- OPAQUE verification mathematically proves password knowledge
- Only correct password can generate valid `finishLoginRequest`
- No password ever transmitted or stored

### 🗝️ Vault Key Recovery After Login

#### Step 1: Retrieve Wrapped Vault Key
```typescript
// After successful login, get encrypted vault key
const { wrappedVaultKey } = await fetch('/me/wrapped-key', {
  credentials: 'include' // Sends JWT cookie
}).then(r => r.json())

// Backend (UsersController.getWrappedKey()):
// 1. AuthGuard extracts JWT from cookie
// 2. Verifies JWT signature with JWT_SECRET
// 3. Extracts userId from JWT payload
// 4. Returns user's encrypted vault key from database
```

#### Step 2: Decrypt Vault Key Locally
```typescript
// Derive same key-wrapping key from login exportKey
const keyWrappingKey = sodium.crypto_kdf_derive_from_key(
  32, 1, 'vaultkey', loginFinishResult.exportKey
)

// Decrypt vault key (only possible with correct password)
const vaultKey = sodium.crypto_secretbox_open_easy(
  sodium.from_base64(wrappedVaultKey),
  nonce,
  keyWrappingKey
)

// Now we have the vault key to encrypt/decrypt password items
```

## 🔒 Password Item Encryption/Decryption

### Creating Encrypted Password Item

#### Step 1: Encrypt Data Client-Side
```typescript
// User adds new password item
const passwordData = {
  title: "Gmail Account",
  username: "user@gmail.com", 
  password: "user_secret_password",
  notes: "Personal email account"
}

// Using libsodium-wrappers-sumo for each field
import sodium from 'libsodium-wrappers-sumo'

// Generate unique nonce for each field (prevents pattern analysis)
const titleNonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
const passwordNonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)

// Encrypt each field separately with vault key
const encryptedData = {
  titleNonce: sodium.to_base64(titleNonce),
  titleCiphertext: sodium.to_base64(
    sodium.crypto_secretbox_easy(passwordData.title, titleNonce, vaultKey)
  ),
  passwordNonce: sodium.to_base64(passwordNonce),
  passwordCiphertext: sodium.to_base64(
    sodium.crypto_secretbox_easy(passwordData.password, passwordNonce, vaultKey)
  ),
  isLong: passwordData.password.length > 20 // Server stores this for filtering
}
```

#### Step 2: Send to Backend
```typescript
// Backend (PasswordsController.create()):
// 1. AuthGuard validates JWT cookie
// 2. Extracts userId from JWT payload  
// 3. Validates base64 format with b64Info() utility
// 4. Stores encrypted data in PostgreSQL
// 5. Returns: { id: "generated_item_id" }

const response = await fetch('/vault/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // JWT cookie
  body: JSON.stringify(encryptedData)
})
```

### Retrieving and Decrypting Password Items

#### Step 1: Fetch Encrypted Items
```typescript
// Get user's encrypted password list
const response = await fetch('/vault/items?page=1&type=normal', {
  credentials: 'include'
})

// Backend (PasswordsController.findAll()):
// 1. AuthGuard validates JWT cookie
// 2. Filters by userId (users only see their own items)
// 3. Supports pagination and filtering (isLong field)
// 4. Returns encrypted items (server can't read content)
```

#### Step 2: Decrypt Items Client-Side
```typescript
const items = await response.json()

const decryptedItems = items.map(item => {
  // Decrypt each field using stored nonces and vault key
  const title = sodium.to_string(
    sodium.crypto_secretbox_open_easy(
      sodium.from_base64(item.titleCiphertext),
      sodium.from_base64(item.titleNonce),
      vaultKey
    )
  )
  
  const password = sodium.to_string(
    sodium.crypto_secretbox_open_easy(
      sodium.from_base64(item.passwordCiphertext),
      sodium.from_base64(item.passwordNonce),
      vaultKey
    )
  )
  
  return { id: item.id, title, password, ...otherFields }
})
```

## 🛡️ Security Architecture

### Authentication Security
- **No Password Transmission** - OPAQUE ensures passwords never leave client
- **Session Management** - Redis-based sessions with automatic expiry
- **JWT Security** - HttpOnly cookies prevent XSS attacks
- **Username Enumeration Protection** - Backend returns decoy responses for invalid users

### Encryption Security
- **Client-Side Encryption** - All sensitive data encrypted before transmission
- **Unique Nonces** - Each encrypted field uses unique random nonce
- **Key Derivation** - Vault keys derived from OPAQUE export keys
- **Zero Server Knowledge** - Server stores only encrypted data

### Frontend Security Features
```typescript
// JWT stored in httpOnly cookie (immune to XSS)
response.cookie('auth', token, {
  httpOnly: true,              // JavaScript can't access
  secure: NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict',          // CSRF protection
  maxAge: 24 * 60 * 60 * 1000  // 24-hour expiry
})

// Rate limiting on backend prevents brute force
@ThrottlerModule.forRoot([{
  ttl: 60000,  // 1 minute window
  limit: 10,   // 10 requests max
}])
```

## 📁 Project Structure

```
src/
├── 📱 app/                    # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   │   ├── login/            # Login form with OPAQUE
│   │   └── register/         # Registration with crypto setup
│   ├── vault/                # Password manager interface
│   │   ├── components/       # Vault-specific components
│   │   └── page.tsx          # Main vault dashboard
│   ├── components/           # Shared React components
│   │   └── theme-provider.tsx # Material-UI theme wrapper
│   ├── globals.css           # Global styles with custom animations
│   └── layout.tsx            # Root layout with providers
├── 🔧 lib/                   # Utility libraries
│   ├── api.ts               # HTTP client for backend communication
│   ├── crypto.ts            # Wrapper functions for libsodium operations
│   └── types.ts             # TypeScript definitions
└── 🎨 styles/               # Additional styling files
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 8.0.0
```

### Installation & Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd lock_pulse_next
npm install
```

2. **Environment Configuration**
```bash
# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Development Server**
```bash
npm run dev
# Open http://localhost:3000
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
```

## 🌐 API Integration

### Authentication API Client

```typescript
// lib/api.ts - HTTP client for backend communication
const API_BASE = process.env.NEXT_PUBLIC_API_URL

const apiRequest = async (endpoint: string, options: RequestInit) => {
  const url = `${API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    credentials: 'include', // Always include JWT cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'Request failed')
  }
  
  return response.json()
}

export const auth = {
  // OPAQUE registration flow
  registerStart: (data: { username: string; registrationRequest: string }) =>
    apiRequest('/auth/register/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  registerFinish: (data: {
    username: string;
    registrationRecord: string;
    wrappedVaultKey: string;
    vaultKdfSalt: string;
    vaultKdfParams: any;
  }) =>
    apiRequest('/auth/register/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // OPAQUE login flow  
  loginStart: (data: { username: string; startLoginRequest: string }) =>
    apiRequest('/auth/login/start', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  loginFinish: (data: { loginId: string; finishLoginRequest: string }) =>
    apiRequest('/auth/login/finish', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
```

## 🎨 UI Components & User Experience

### Authentication Pages
- **Registration Form** - Multi-step wizard with progress indicator
- **Login Form** - Clean interface with error handling
- **Loading States** - Smooth transitions during crypto operations

### Vault Interface
- **Password List** - Encrypted items displayed after decryption
- **Add/Edit Forms** - Real-time encryption before save
- **Search/Filter** - Client-side search through decrypted data

### Theme Support
```typescript
// app/components/theme-provider.tsx
// Material-UI theme with next-themes for dark/light mode
import { ThemeProvider } from '@mui/material/styles'
import { useTheme } from 'next-themes'

// Custom animations in globals.css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

## 🔍 Error Handling & User Feedback

### Toast Notifications
```typescript
// Using sonner for user feedback
import { toast } from 'sonner'

// Success notifications
toast.success('Password saved successfully!')

// Error handling with specific messages
toast.error('Invalid master password')
toast.error('Network error - please try again')
```

### Loading States
- **Cryptographic Operations** - Show progress during OPAQUE calculations
- **API Requests** - Loading spinners for network operations
- **Vault Operations** - Smooth transitions for encrypt/decrypt

## 🧪 Security Considerations

### Client-Side Security
- **Memory Management** - Sensitive keys cleared after use
- **No Local Storage** - Passwords never stored in browser storage
- **HTTPS Only** - All communication encrypted in transit
- **Content Security Policy** - XSS protection headers

### Cryptographic Best Practices
- **Authenticated Encryption** - ChaCha20Poly1305 prevents tampering
- **Random Nonces** - Unique nonces for each encryption operation
- **Key Derivation** - Proper key derivation from OPAQUE export keys
- **Forward Secrecy** - Session keys don't compromise vault data

## 📱 Progressive Web App Features

### Performance Optimizations
- **Next.js App Router** - Optimized routing and loading
- **Component Lazy Loading** - Reduced initial bundle size
- **Image Optimization** - Automatic image optimization
- **Static Generation** - Pre-built pages where possible

### User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Offline Support** - Service worker for basic offline functionality
- **Install Prompt** - Can be installed as PWA
- **Fast Loading** - Optimized bundle splitting

## 📚 Learn More

### OPAQUE Protocol Resources
- [@serenity-kit/opaque Documentation](https://github.com/serenity-kit/opaque) - Library used for OPAQUE implementation
- [OPAQUE RFC](https://datatracker.ietf.org/doc/draft-irtf-cfrg-opaque/) - Official protocol specification

### Libsodium Resources  
- [Libsodium Documentation](https://doc.libsodium.org/) - Cryptographic library documentation
- [ChaCha20Poly1305](https://doc.libsodium.org/secret-key_cryptography/aead/chacha20-poly1305) - Authenticated encryption

### Next.js Resources
- [Next.js Documentation](https://nextjs.org/docs) - Framework documentation
- [React 19 Features](https://react.dev/blog/2024/04/25/react-19) - Latest React features

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables (Production)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/vault-enhancement`)
3. Test thoroughly with different scenarios
4. Ensure security best practices
5. Commit changes (`git commit -m 'Add vault enhancement'`)
6. Push to branch (`git push origin feature/vault-enhancement`)
7. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ using Next.js, OPAQUE Protocol & Client-Side Encryption</p>
  <p>🔐 <strong>Your Password Never Leaves Your Device</strong> 🔐</p>
  
  <p>
    <img src="https://img.shields.io/badge/Encryption-Client%20Side-green?style=flat" alt="Client-Side Encryption" />
    <img src="https://img.shields.io/badge/Protocol-OPAQUE-blue?style=flat" alt="OPAQUE Protocol" />
    <img src="https://img.shields.io/badge/Security-Zero%20Knowledge-red?style=flat" alt="Zero Knowledge" />
  </p>
</div>
