import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'client-side-encryption-explained',
  title: 'Client-Side Encryption Explained: Security in Your Browser',
  description: 'Discover how client-side encryption protects your data before it ever leaves your device.',
  readTime: '6 min read',
  date: '2024-12-18',
  tags: ['Encryption', 'Security', 'Technology'],
  relatedBlogs: [
    { slug: 'what-is-zero-knowledge-password-manager', title: 'What is a Zero-Knowledge Password Manager?' },
    { slug: 'aes-256-encryption-standard', title: 'AES-256: The Encryption Standard' },
    { slug: 'server-side-vs-client-side-security', title: 'Server-Side vs Client-Side Security' },
  ],
  content: () => (
    <>
      <h2>What is Client-Side Encryption?</h2>
      <p>
        Client-side encryption means your data is encrypted on your device before transmission. Your browser
        performs all encryption operations, ensuring sensitive information never travels in plaintext.
      </p>

      <h3>The Browser as a Security Vault</h3>
      <p>
        Modern browsers are powerful computing environments. <strong>LockPulse</strong> leverages the Web Crypto API
        to perform military-grade encryption directly in your browser. This means:
      </p>
      <ul>
        <li>No server-side decryption keys</li>
        <li>No plaintext password transmission</li>
        <li>Complete control over your data</li>
      </ul>

      <h3>How LockPulse Implements Client-Side Encryption</h3>
      <p>
        When you save a password in a <strong>LockPulse Project</strong>, here's what happens behind the scenes:
      </p>
      <ol>
        <li>You enter a password for a service (e.g., your GitHub token)</li>
        <li>Your master password key is retrieved from secure browser storage</li>
        <li>AES-256-GCM encryption is performed locally</li>
        <li>The encrypted blob is sent to our servers</li>
        <li>We store the blob without any decryption capability</li>
      </ol>

      <h2>Project-Based Organization with Client-Side Security</h2>
      <p>
        <strong>LockPulse's project feature</strong> lets you organize credentials by context—development, production,
        personal, etc. Each project maintains the same client-side encryption model. Whether you're storing
        <a href="/blog/managing-aws-credentials-securely">AWS credentials</a> or
        <a href="/blog/database-password-management">database passwords</a>, everything is encrypted before leaving your browser.
      </p>

      <h3>Performance Considerations</h3>
      <p>
        Client-side encryption is fast. Modern browsers can encrypt thousands of credentials in milliseconds.
        LockPulse optimizes this further by caching your encryption key in secure memory during your session.
      </p>

      <h2>Trust but Verify</h2>
      <p>
        LockPulse's encryption code is open source. Security experts can audit our implementation to verify
        that client-side encryption is properly implemented. This transparency builds trust beyond marketing claims.
      </p>
    </>
  ),
}
