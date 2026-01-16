import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'server-side-vs-client-side-security',
  title: 'Server-Side vs Client-Side Security: What\'s the Difference?',
  description: 'Understanding where encryption happens and why it matters for password security.',
  readTime: '6 min read',
  date: '2024-12-11',
  tags: ['Security', 'Technology', 'Comparison'],
  relatedBlogs: [
    { slug: 'client-side-encryption-explained', title: 'Client-Side Encryption' },
    { slug: 'password-manager-comparison', title: 'Password Manager Comparison' },
    { slug: 'aes-256-encryption-standard', title: 'AES-256 Encryption' },
  ],
  content: () => (
    <>
      <h2>Where Encryption Happens Matters</h2>
      <p>
        The location of encryption—client-side (your device) versus server-side (provider's servers)—fundamentally
        changes the security model of a password manager. <strong>LockPulse</strong> uses client-side encryption
        exclusively, ensuring your data is protected before it ever leaves your device.
      </p>

      <h3>Server-Side Encryption Explained</h3>
      <p>
        With server-side encryption:
      </p>
      <ol>
        <li>You enter your password in plaintext</li>
        <li>It's transmitted to the server (usually over HTTPS)</li>
        <li>The server encrypts it with keys it controls</li>
        <li>The encrypted password is stored in the database</li>
      </ol>
      <p>
        <strong>The Problem:</strong> The server sees your password in plaintext. The provider could log it,
        employees could access it, or a breach could expose it during transmission.
      </p>

      <h3>Client-Side Encryption (LockPulse's Approach)</h3>
      <p>
        With <a href="/blog/client-side-encryption-explained">client-side encryption</a>:
      </p>
      <ol>
        <li>You enter your password on your device</li>
        <li>Your browser encrypts it using <a href="/blog/aes-256-encryption-standard">AES-256</a></li>
        <li>Only the encrypted blob is transmitted</li>
        <li>Servers store encrypted data without decryption capability</li>
      </ol>
      <p>
        <strong>The Advantage:</strong> Your password never exists in plaintext outside your device. Even
        LockPulse cannot see what you're storing.
      </p>

      <h2>Trust Models: A Critical Difference</h2>

      <h3>Server-Side: Trust-Based Security</h3>
      <p>
        You must trust the provider to:
      </p>
      <ul>
        <li>Not log your plaintext passwords</li>
        <li>Properly secure their encryption keys</li>
        <li>Resist government pressure for backdoors</li>
        <li>Have no malicious employees</li>
        <li>Never make implementation mistakes</li>
      </ul>

      <h3>Client-Side: Trustless Security</h3>
      <p>
        With LockPulse's <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge architecture</a>:
      </p>
      <ul>
        <li>Trust is mathematically unnecessary</li>
        <li>We cannot decrypt your data even if we wanted to</li>
        <li>Government subpoenas yield only encrypted blobs</li>
        <li>Employee access is impossible</li>
        <li>Open source code allows independent verification</li>
      </ul>

      <h2>Performance Implications</h2>

      <h3>Server-Side Performance</h3>
      <p>
        Advantages:
      </p>
      <ul>
        <li>Works on low-powered devices (server does the work)</li>
        <li>Consistent performance across all devices</li>
      </ul>
      <p>
        Disadvantages:
      </p>
      <ul>
        <li>Network latency for every operation</li>
        <li>Server load limits scalability</li>
        <li>Offline access requires caching (security risk)</li>
      </ul>

      <h3>Client-Side Performance</h3>
      <p>
        Advantages:
      </p>
      <ul>
        <li>No network latency for encryption/decryption</li>
        <li>Hardware-accelerated AES on modern browsers</li>
        <li>Offline access with full security</li>
        <li>Infinitely scalable (no server bottleneck)</li>
      </ul>
      <p>
        Disadvantages:
      </p>
      <ul>
        <li>Requires modern browser with Web Crypto API</li>
        <li>Initial encryption key derivation takes ~1 second</li>
      </ul>

      <h2>Real-World Scenarios</h2>

      <h3>Scenario 1: Data Breach</h3>
      <p>
        <strong>Server-Side:</strong> Attackers get encrypted passwords. If encryption keys are stored nearby
        or implementation is flawed, passwords could be decrypted.
      </p>
      <p>
        <strong>Client-Side (LockPulse):</strong> Attackers get useless encrypted blobs. Without individual
        user master passwords, data remains secure indefinitely.
      </p>

      <h3>Scenario 2: Malicious Insider</h3>
      <p>
        <strong>Server-Side:</strong> Employee with database access could potentially decrypt passwords or
        inject code to log plaintext passwords.
      </p>
      <p>
        <strong>Client-Side (LockPulse):</strong> Employees see only encrypted data. Even administrators
        cannot access user credentials.
      </p>

      <h3>Scenario 3: Government Subpoena</h3>
      <p>
        <strong>Server-Side:</strong> Company may be forced to hand over decryption keys or implement backdoors.
      </p>
      <p>
        <strong>Client-Side (LockPulse):</strong> We can only provide encrypted data. Decryption is impossible
        without user master passwords.
      </p>

      <h2>Hybrid Approaches: The Worst of Both Worlds?</h2>
      <p>
        Some password managers claim "client-side encryption" but use hybrid models:
      </p>
      <ul>
        <li>Password encrypted client-side</li>
        <li>Encryption key encrypted with server-side key</li>
        <li>Server can decrypt if needed for "features"</li>
      </ul>
      <p>
        This defeats zero-knowledge security. True client-side encryption means the server never has
        decryption capability—period.
      </p>

      <h2>How to Verify True Client-Side Encryption</h2>
      <p>
        Check for these signs:
      </p>
      <ul>
        <li><strong>Open Source:</strong> Can you audit the encryption code?</li>
        <li><strong>Master Password Never Transmitted:</strong> Does it leave your device?</li>
        <li><strong>No Password Reset:</strong> If they can reset it, they can decrypt</li>
        <li><strong>Web Crypto API Usage:</strong> Browser-native encryption</li>
        <li><strong>Independent Security Audits:</strong> Third-party verification</li>
      </ul>

      <h2>Making the Choice</h2>
      <p>
        For maximum security, client-side encryption is non-negotiable. When managing sensitive credentials
        like <a href="/blog/managing-aws-credentials-securely">AWS keys</a> or <a href="/blog/database-password-management">database passwords</a>,
        you need mathematical guarantees, not trust-based promises.
      </p>
      <p>
        <strong>LockPulse's commitment:</strong> 100% client-side encryption, zero server-side decryption,
        complete user control. Learn more about our <a href="/blog/security-technical-overview">security architecture</a>.
      </p>
    </>
  ),
}
