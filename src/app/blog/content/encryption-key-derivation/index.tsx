import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'encryption-key-derivation',
  title: 'Encryption Key Derivation: How Your Master Password Becomes a Key',
  description: 'Technical deep-dive into PBKDF2 and how LockPulse derives encryption keys.',
  readTime: '7 min read',
  date: '2024-12-06',
  tags: ['Technology', 'Encryption', 'Security'],
  relatedBlogs: [
    { slug: 'aes-256-encryption-standard', title: 'AES-256 Encryption' },
    { slug: 'client-side-encryption-explained', title: 'Client-Side Encryption' },
    { slug: 'security-technical-overview', title: 'Security Technical Overview' },
  ],
  content: () => (
    <>
      <h2>From Password to Cryptographic Key</h2>
      <p>
        Your master password isn't used directly to encrypt your data. Instead, it goes through a process called
        <strong> key derivation</strong> to create a strong cryptographic key. <strong>LockPulse</strong> uses
        PBKDF2 (Password-Based Key Derivation Function 2) for this critical transformation.
      </p>

      <h3>Why Not Use Passwords Directly?</h3>
      <p>
        Passwords have problems as encryption keys:
      </p>
      <ul>
        <li>Variable length (passwords can be 10 or 50 characters)</li>
        <li>Low entropy (humans choose predictable patterns)</li>
        <li>Character encoding issues</li>
        <li>Not suitable for cryptographic algorithms that expect fixed-length keys</li>
      </ul>

      <h2>The PBKDF2 Algorithm</h2>
      <p>
        PBKDF2 transforms your master password into a cryptographically strong key through these steps:
      </p>

      <h3>Step 1: Salting</h3>
      <p>
        A unique, random <strong>salt</strong> is generated for your account:
      </p>
      <ul>
        <li>128-bit (16 bytes) of cryptographically random data</li>
        <li>Prevents rainbow table attacks</li>
        <li>Ensures identical passwords create different keys</li>
        <li>Stored alongside your encrypted data (not secret)</li>
      </ul>

      <h3>Step 2: Multiple Iterations</h3>
      <p>
        The password and salt are hashed repeatedly:
      </p>
      <ul>
        <li><strong>LockPulse uses 100,000 iterations</strong></li>
        <li>Each iteration applies SHA-256 hashing</li>
        <li>Takes approximately 1 second on modern hardware</li>
        <li>Makes brute-force attacks computationally expensive</li>
      </ul>

      <h3>Step 3: Key Output</h3>
      <p>
        The final result is a 256-bit encryption key:
      </p>
      <ul>
        <li>Perfect length for <Link href="/blog/aes-256-encryption-standard">AES-256 encryption</Link></li>
        <li>High entropy regardless of password strength</li>
        <li>Used to encrypt/decrypt your credentials</li>
        <li>Never transmitted or stored</li>
      </ul>

      <h2>Real-World Example</h2>
      <p>
        Here's what happens when you create a <strong>LockPulse</strong> account:
      </p>

      <h3>Account Creation</h3>
      <ol>
        <li>You enter master password: <code>Crimson7-Telescope!-Marathon42</code></li>
        <li>LockPulse generates random salt: <code>a3f9c2d8e1b4...</code></li>
        <li>PBKDF2 runs 100,000 iterations combining password + salt</li>
        <li>Output: 256-bit key: <code>8f3a9c2d...</code> (used for encryption)</li>
        <li>Salt stored with your account, key stays in browser memory</li>
      </ol>

      <h3>Logging In</h3>
      <ol>
        <li>You enter your master password</li>
        <li>Browser retrieves your salt from server</li>
        <li>PBKDF2 derives the same key locally</li>
        <li>Key decrypts your vault</li>
        <li>If password is wrong, derived key won't decrypt data</li>
      </ol>

      <h2>Why 100,000 Iterations?</h2>
      <p>
        The iteration count balances security and usability:
      </p>

      <h3>Security Perspective</h3>
      <ul>
        <li>Attackers must run 100,000 iterations per password guess</li>
        <li>Makes brute-force attacks 100,000x slower</li>
        <li>A 10-character password becomes much harder to crack</li>
        <li>Industry recommendations suggest 100,000+ for PBKDF2-SHA256</li>
      </ul>

      <h3>Usability Perspective</h3>
      <ul>
        <li>1 second delay during login (acceptable)</li>
        <li>Happens only once per session</li>
        <li>Key cached in secure memory afterward</li>
        <li>No delay when accessing individual credentials</li>
      </ul>

      <h2>Beyond PBKDF2: Future-Proofing</h2>
      <p>
        While PBKDF2 is industry-standard, newer algorithms exist:
      </p>

      <h3>Argon2 (Future Consideration)</h3>
      <ul>
        <li>Winner of Password Hashing Competition (2015)</li>
        <li>Memory-hard (resistant to GPU/ASIC attacks)</li>
        <li>Even stronger than PBKDF2</li>
        <li>LockPulse may migrate to Argon2 in future updates</li>
      </ul>

      <h3>Backward Compatibility</h3>
      <p>
        Any algorithm change would:
      </p>
      <ul>
        <li>Maintain support for existing PBKDF2-derived keys</li>
        <li>Gradually migrate users during password changes</li>
        <li>Never compromise existing vault security</li>
      </ul>

      <h2>Key Derivation in Team Sharing</h2>
      <p>
        When sharing <Link href="/blog/secure-credential-sharing-teams">credentials with teams</Link>:
      </p>

      <h3>Individual Key Derivation</h3>
      <ul>
        <li>Each team member has their own master password</li>
        <li>Each derives their own unique encryption key</li>
        <li>Shared credentials re-encrypted for each recipient</li>
        <li>No shared keys or master passwords</li>
      </ul>

      <h3>Public Key Cryptography Layer</h3>
      <p>
        For team sharing, LockPulse adds another layer:
      </p>
      <ol>
        <li>Your derived key encrypts a public/private key pair</li>
        <li>Public key shared with team (for encrypting to you)</li>
        <li>Private key stays encrypted with your derived key</li>
        <li>Enables secure sharing without key exchange</li>
      </ol>

      <h2>Security Implications</h2>

      <h3>What Makes Key Derivation Secure?</h3>
      <ul>
        <li><strong>One-way function:</strong> Can't reverse engineer password from key</li>
        <li><strong>Deterministic:</strong> Same password + salt always produces same key</li>
        <li><strong>Slow by design:</strong> Resists brute-force attacks</li>
        <li><strong>Salted:</strong> Different keys even for identical passwords</li>
      </ul>

      <h3>Attack Scenarios</h3>
      <p>
        <strong>Scenario 1: Database Breach</strong>
      </p>
      <ul>
        <li>Attacker gets encrypted credentials + salts</li>
        <li>Must brute-force each password individually</li>
        <li>100,000 iterations per guess makes this impractical</li>
        <li>Strong master passwords remain uncrackable</li>
      </ul>

      <p>
        <strong>Scenario 2: Weak Master Password</strong>
      </p>
      <ul>
        <li>If password is common (e.g., "password123")</li>
        <li>Attacker could eventually crack it</li>
        <li>This is why <Link href="/blog/creating-strong-master-password">creating a strong master password</Link> is critical</li>
      </ul>

      <h2>Technical Details for Security Professionals</h2>

      <h3>PBKDF2 Parameters in LockPulse</h3>
      <ul>
        <li><strong>Algorithm:</strong> PBKDF2-SHA256</li>
        <li><strong>Iterations:</strong> 100,000</li>
        <li><strong>Salt length:</strong> 128 bits (16 bytes)</li>
        <li><strong>Derived key length:</strong> 256 bits (32 bytes)</li>
        <li><strong>Implementation:</strong> Web Crypto API (native browser)</li>
      </ul>

      <h3>Key Storage</h3>
      <ul>
        <li>Derived key stored in browser memory only</li>
        <li>Never persisted to disk</li>
        <li>Cleared when session ends</li>
        <li>Requires re-derivation on next login</li>
      </ul>

      <h2>Comparing Key Derivation Methods</h2>

      <h3>PBKDF2 vs. bcrypt</h3>
      <ul>
        <li><strong>PBKDF2:</strong> Standardized (RFC 2898), widely supported, configurable iterations</li>
        <li><strong>bcrypt:</strong> Memory-hard, good for passwords, less configurable</li>
        <li><strong>LockPulse choice:</strong> PBKDF2 for browser compatibility and standards compliance</li>
      </ul>

      <h3>PBKDF2 vs. scrypt vs. Argon2</h3>
      <ul>
        <li><strong>PBKDF2:</strong> CPU-intensive, well-tested</li>
        <li><strong>scrypt:</strong> Memory-hard, GPU-resistant</li>
        <li><strong>Argon2:</strong> Modern, memory-hard, CPU and GPU resistant</li>
      </ul>

      <h2>Practical Implications for Users</h2>

      <h3>What This Means for You</h3>
      <ul>
        <li>Your master password never leaves your device in any form</li>
        <li>Even LockPulse cannot derive your encryption key</li>
        <li>Different users with same password have different keys (due to salt)</li>
        <li>Forgetting your master password means unrecoverable data</li>
      </ul>

      <h3>Performance Impact</h3>
      <ul>
        <li>~1 second delay on login (key derivation)</li>
        <li>No delay for individual credential access</li>
        <li>Key cached during session</li>
        <li>Modern devices handle this easily</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>✅ Choose a strong, unique <Link href="/blog/creating-strong-master-password">master password</Link></li>
        <li>✅ Never reuse your master password elsewhere</li>
        <li>✅ Understand that key derivation protects weak passwords to some extent</li>
        <li>✅ Accept the 1-second login delay as a security feature</li>
        <li>✅ Trust the mathematics, not marketing claims</li>
      </ul>

      <h2>The Bottom Line</h2>
      <p>
        Key derivation is the mathematical bridge between your memorable password and cryptographic security.
        <strong>LockPulse</strong> uses industry-standard PBKDF2 to ensure that even if our servers are compromised,
        your master password remains safe. Combined with <Link href="/blog/client-side-encryption-explained">client-side encryption</Link>
        and <Link href="/blog/aes-256-encryption-standard">AES-256</Link>, this creates a security model where trust
        is unnecessary—mathematics provides the guarantees.
      </p>
    </>
  ),
}
