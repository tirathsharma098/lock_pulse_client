import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'aes-256-encryption-standard',
  title: 'AES-256: The Encryption Standard Protecting Your Passwords',
  description: 'Understand the encryption algorithm that secures your LockPulse vault.',
  readTime: '6 min read',
  date: '2024-12-05',
  tags: ['Encryption', 'Technology', 'Security'],
  relatedBlogs: [
    { slug: 'client-side-encryption-explained', title: 'Client-Side Encryption Explained' },
    { slug: 'what-is-zero-knowledge-password-manager', title: 'What is Zero-Knowledge?' },
    { slug: 'encryption-key-derivation', title: 'Encryption Key Derivation' },
  ],
  content: () => (
    <>
      <h2>What is AES-256?</h2>
      <p>
        AES-256 (Advanced Encryption Standard with 256-bit keys) is the gold standard for symmetric encryption.
        Used by governments, banks, and security professionals worldwide, it's the same encryption protecting
        your data in <strong>LockPulse</strong>.
      </p>

      <h3>Why 256-Bit Keys Matter</h3>
      <p>
        The "256" in AES-256 refers to the key length in bits. A 256-bit key means there are 2^256 possible
        combinations—that's 115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936 possibilities.
        Even the world's most powerful supercomputers would take billions of years to crack it.
      </p>

      <h3>How LockPulse Uses AES-256</h3>
      <p>
        When you store a password in a <strong>LockPulse Project</strong>, here's the encryption process:
      </p>
      <ol>
        <li>Your master password generates a 256-bit encryption key via PBKDF2</li>
        <li>AES-256-GCM mode encrypts your credential data</li>
        <li>An authentication tag ensures data integrity</li>
        <li>The encrypted blob is stored on our servers</li>
      </ol>

      <h2>AES-256-GCM: Added Protection</h2>
      <p>
        LockPulse uses AES-256 in GCM (Galois/Counter Mode), which provides both encryption and authentication.
        This means we can detect if encrypted data has been tampered with, adding an extra layer of security
        beyond just confidentiality.
      </p>

      <h3>Industry Standard for Sensitive Data</h3>
      <p>
        AES-256 is approved by the NSA for protecting classified information. When managing <a href="/blog/managing-aws-credentials-securely">AWS credentials</a>
        or <a href="/blog/database-password-management">database passwords</a>, you need this level of protection.
      </p>

      <h2>Performance Considerations</h2>
      <p>
        Despite its strength, AES-256 is highly efficient. Modern processors have built-in AES acceleration,
        making encryption and decryption nearly instantaneous. You won't notice any performance impact when
        accessing your <strong>LockPulse vault</strong>.
      </p>

      <h3>Future-Proof Security</h3>
      <p>
        Even with advances in quantum computing, AES-256 is expected to remain secure for decades. By using
        this standard today, LockPulse ensures your credentials are protected against both current and future threats.
      </p>
    </>
  ),
}
