import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'what-is-zero-knowledge-password-manager',
  title: 'What is a Zero-Knowledge Password Manager?',
  description: 'Learn how zero-knowledge architecture keeps your passwords secure, even from the service provider.',
  readTime: '5 min read',
  date: '2024-12-15',
  tags: ['Security', 'Zero-Knowledge', 'Encryption'],
  relatedBlogs: [
    { slug: 'client-side-encryption-explained', title: 'Client-Side Encryption Explained' },
    { slug: 'why-master-password-matters', title: 'Why Your Master Password Matters' },
    { slug: 'password-manager-comparison', title: 'Password Manager Security Comparison' },
  ],
  content: () => (
    <>
      <h2>Understanding Zero-Knowledge Architecture</h2>
      <p>
        A zero-knowledge password manager ensures that only you can decrypt your passwords. Unlike traditional services,
        the provider has no access to your data—mathematically impossible, not just a policy promise.
      </p>

      <h3>How It Works</h3>
      <p>
        When you create an account with <strong>LockPulse</strong>, your master password never leaves your device.
        Instead, it's used to generate an encryption key locally in your browser. This key encrypts all your passwords
        before they're sent to our servers.
      </p>

      <h3>The Encryption Process</h3>
      <ul>
        <li><strong>Step 1:</strong> You enter your master password</li>
        <li><strong>Step 2:</strong> A unique encryption key is derived using PBKDF2</li>
        <li><strong>Step 3:</strong> Your passwords are encrypted with AES-256</li>
        <li><strong>Step 4:</strong> Only encrypted data reaches our servers</li>
      </ul>

      <h3>Real-World Example with LockPulse Projects</h3>
      <p>
        Imagine you're managing credentials for a development project. You store your AWS keys, database passwords,
        and API tokens in a <strong>LockPulse Project</strong>. Each credential is encrypted client-side before storage.
        Even if our servers were compromised, attackers would only find encrypted blobs—useless without your master password.
      </p>

      <h2>Why Zero-Knowledge Matters</h2>
      <p>
        Traditional password managers hold the keys to decrypt your data. This creates a single point of failure.
        With zero-knowledge architecture, you maintain complete control. LockPulse's <strong>project-based organization</strong>
        makes it easy to separate work, personal, and team credentials while maintaining this security model.
      </p>

      <h3>Benefits for Teams</h3>
      <p>
        When using <a href="/blog/secure-credential-sharing-teams">LockPulse for team collaboration</a>, each team
        member has their own encryption keys. Shared project credentials are re-encrypted for each recipient,
        ensuring zero-knowledge principles apply to collaboration too.
      </p>
    </>
  ),
}
