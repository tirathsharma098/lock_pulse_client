import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'creating-strong-master-password',
  title: 'Creating a Strong Master Password: A Practical Guide',
  description: 'Step-by-step guide to creating a memorable yet secure master password.',
  readTime: '4 min read',
  date: '2024-12-07',
  tags: ['Security', 'Best Practices', 'Guide'],
  relatedBlogs: [
    { slug: 'why-master-password-matters', title: 'Why Master Password Matters' },
    { slug: 'password-recovery-options', title: 'Password Recovery Options' },
    { slug: 'security-best-practices', title: 'Security Best Practices' },
  ],
  content: () => (
    <>
      <h2>Your Master Password: The Foundation of Security</h2>
      <p>
        In a <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge system</a> like <strong>LockPulse</strong>,
        your master password is everything. It's the only key to your vault, and unlike traditional services,
        we can never reset it. This guide will help you create one that's both secure and memorable.
      </p>

      <h3>What Makes a Password Strong?</h3>
      <p>
        A strong master password has four qualities:
      </p>
      <ul>
        <li><strong>Length:</strong> At least 16 characters (longer is better)</li>
        <li><strong>Complexity:</strong> Mix of uppercase, lowercase, numbers, symbols</li>
        <li><strong>Uniqueness:</strong> Never used anywhere else</li>
        <li><strong>Memorability:</strong> You can remember it without writing it down</li>
      </ul>

      <h2>The Passphrase Method (Recommended)</h2>
      <p>
        Passphrases are easier to remember than random characters while being incredibly secure.
      </p>

      <h3>Step 1: Choose 4-5 Random Words</h3>
      <p>
        Pick words that have personal meaning but aren't obvious:
      </p>
      <ul>
        <li>❌ Bad: <code>password-123-lockpulse</code> (too predictable)</li>
        <li>✅ Good: <code>Crimson-Telescope-Marathon-Coffee</code></li>
      </ul>

      <h3>Step 2: Add Numbers and Symbols</h3>
      <p>
        Insert numbers and symbols between words:
      </p>
      <ul>
        <li><code>Crimson7-Telescope!-Marathon42-Coffee$</code></li>
      </ul>

      <h3>Step 3: Make It Personal (But Not Obvious)</h3>
      <p>
        Use a memory technique to make it stick:
      </p>
      <ul>
        <li>Think of a story: "I used a crimson telescope to watch the marathon while drinking coffee"</li>
        <li>Associate with a vivid mental image</li>
        <li>Never use: birthdays, names, addresses, or dictionary words alone</li>
      </ul>

      <h2>The Sentence Method</h2>
      <p>
        Turn a memorable sentence into a password:
      </p>

      <h3>Example Process</h3>
      <p>
        <strong>Sentence:</strong> "I started using LockPulse in 2024 to secure my 15 AWS projects!"
      </p>
      <p>
        <strong>Password:</strong> <code>IsuLPi2024tsm15AWSpro!</code>
      </p>
      <p>
        Take the first letter of each word, keep numbers and symbols. This creates a 22-character password
        that's hard to crack but easy for you to remember.
      </p>

      <h2>What to Avoid</h2>

      <h3>Common Mistakes</h3>
      <ul>
        <li>❌ Using personal information (names, birthdates)</li>
        <li>❌ Dictionary words without modification</li>
        <li>❌ Keyboard patterns (<code>qwerty</code>, <code>asdfgh</code>)</li>
        <li>❌ Repeated characters (<code>aaaa</code>)</li>
        <li>❌ Common substitutions only (<code>P@ssw0rd</code>)</li>
      </ul>

      <h3>Reusing Passwords</h3>
      <p>
        Your master password should be completely unique. Never use it for:
      </p>
      <ul>
        <li>Email accounts</li>
        <li>Social media</li>
        <li>Banking websites</li>
        <li>Any other service</li>
      </ul>

      <h2>Testing Your Password Strength</h2>
      <p>
        Ask yourself these questions:
      </p>
      <ul>
        <li>Is it at least 16 characters? (Preferably 20+)</li>
        <li>Does it include uppercase and lowercase letters?</li>
        <li>Does it have numbers and symbols?</li>
        <li>Would it take centuries to crack with current computing power?</li>
        <li>Can you remember it without writing it down?</li>
      </ul>

      <h3>Strength Examples</h3>
      <ul>
        <li>❌ Weak: <code>MyPassword123</code> (cracked in seconds)</li>
        <li>⚠️ Moderate: <code>MyP@ssw0rd!2024</code> (cracked in hours/days)</li>
        <li>✅ Strong: <code>Crimson7-Telescope!-Marathon42</code> (centuries to crack)</li>
      </ul>

      <h2>Memorization Tips</h2>

      <h3>The First Week</h3>
      <p>
        When you first create your master password:
      </p>
      <ol>
        <li>Write it down and store in a safe place (temporarily)</li>
        <li>Type it 10 times on day one</li>
        <li>Type it 5 times daily for a week</li>
        <li>Practice typing it without looking</li>
        <li>After muscle memory forms, destroy the written copy</li>
      </ol>

      <h3>Muscle Memory Technique</h3>
      <p>
        Your fingers will learn the pattern faster than your brain. Log in to LockPulse frequently
        during the first month. The typing motion becomes automatic.
      </p>

      <h2>What If You Forget?</h2>
      <p>
        Remember: with <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge encryption</a>,
        forgotten master passwords mean unrecoverable data. That's by design—it's what keeps your credentials
        secure even if LockPulse is compromised.
      </p>
      <p>
        Before finalizing your master password:
      </p>
      <ul>
        <li>Test it for a week before migrating all passwords</li>
        <li>Ensure you can type it reliably</li>
        <li>Consider an emergency backup method (see <a href="/blog/emergency-access-planning">emergency access planning</a>)</li>
      </ul>

      <h2>Changing Your Master Password</h2>
      <p>
        While master passwords should be permanent, you can change yours in LockPulse. The process:
      </p>
      <ol>
        <li>Decrypts all credentials with old master password</li>
        <li>Re-encrypts with new master password</li>
        <li>Updates all encryption keys</li>
      </ol>
      <p>
        Change your master password if:
      </p>
      <ul>
        <li>You suspect it's been compromised</li>
        <li>You accidentally shared it</li>
        <li>It's too weak by modern standards</li>
      </ul>
    </>
  ),
}
