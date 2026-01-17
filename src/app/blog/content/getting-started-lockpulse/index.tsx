import { BlogPost } from '../../types'
const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://lockpulse.codedigit.in';

export const blog: BlogPost = {
  slug: 'getting-started-lockpulse',
  title: 'Getting Started with LockPulse: Your First 15 Minutes',
  description: 'Quick start guide to setting up your secure password vault.',
  readTime: '5 min read',
  date: '2024-12-16',
  tags: ['Guide', 'Getting Started', 'Tutorial'],
  relatedBlogs: [
    { slug: 'creating-strong-master-password', title: 'Creating Strong Master Password' },
    { slug: 'importing-passwords-guide', title: 'Importing Passwords Guide' },
    { slug: 'first-project-setup', title: 'Setting Up Your First Project' },
  ],
  content: () => (
    <>
      <h2>Welcome to LockPulse</h2>
      <p>
        You've decided to take control of your password security with <strong>LockPulse</strong>. This guide
        will walk you through the initial setup process, from creating your account to storing your first
        credentials. In just 15 minutes, you'll have a secure, zero-knowledge password vault.
      </p>

      <h3>What You'll Accomplish</h3>
      <ul>
        <li>Create your LockPulse account with a strong master password</li>
        <li>Understand zero-knowledge security</li>
        <li>Set up your first project</li>
        <li>Add your first credentials</li>
        <li>Configure browser extension</li>
      </ul>

      <h2>Step 1: Create Your Account (3 minutes)</h2>

      <h3>Visit LockPulse</h3>
      <p>
        Navigate to <strong>{baseUrl}</strong> and click "Create Account" or "Get Started Free".
      </p>

      <h3>Choose Your Master Password</h3>
      <p>
        This is the most important step. Your master password is the only key to your vault. Take time to
        create a strong, memorable password using our <a href="/blog/creating-strong-master-password">master password guide</a>.
      </p>
      <p>
        <strong>Quick tips:</strong>
      </p>
      <ul>
        <li>Use 4-5 random words: <code>Crimson-Telescope-Marathon-Coffee</code></li>
        <li>Add numbers and symbols: <code>Crimson7-Telescope!-Marathon42</code></li>
        <li>Make it at least 16 characters long</li>
        <li>Never reuse a password from another service</li>
      </ul>

      <h3>Important: No Password Recovery</h3>
      <p>
        LockPulse uses <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge encryption</a>.
        We cannot reset your master password. If you forget it, your data is unrecoverable. This is a feature,
        not a bug—it's what keeps your data truly secure.
      </p>

      <h2>Step 2: Enable Two-Factor Authentication (2 minutes)</h2>

      <h3>Add Extra Security</h3>
      <p>
        After creating your account, immediately enable 2FA:
      </p>
      <ol>
        <li>Go to Settings → Security</li>
        <li>Click "Enable Two-Factor Authentication"</li>
        <li>Scan QR code with authenticator app (Google Authenticator, Authy)</li>
        <li>Enter verification code to confirm</li>
        <li>Save backup codes in a secure location</li>
      </ol>

      <h3>Why 2FA Matters</h3>
      <p>
        Even with a strong master password, 2FA adds another layer of protection. If someone learns your
        master password, they still can't access your account without your second factor.
      </p>

      <h2>Step 3: Set Up Your First Project (3 minutes)</h2>

      <h3>Understanding Projects</h3>
      <p>
        <strong>LockPulse Projects</strong> let you organize credentials by context. Instead of one big list,
        group credentials logically. Learn more about <a href="/blog/project-based-credential-management">project-based management</a>.
      </p>

      <h3>Create Your First Project</h3>
      <ol>
        <li>Click "New Project" in the dashboard</li>
        <li>Name it descriptively (e.g., "Personal Accounts", "Work - DevOps", "Finance")</li>
        <li>Add a description (optional but helpful)</li>
        <li>Choose a color for visual organization</li>
        <li>Click "Create Project"</li>
      </ol>

      <h3>Suggested First Projects</h3>
      <ul>
        <li><strong>Personal:</strong> Social media, email, shopping accounts</li>
        <li><strong>Work:</strong> Professional tools and services</li>
        <li><strong>Finance:</strong> Banking, investment, payment services</li>
        <li><strong>Development:</strong> GitHub, AWS, databases (for developers)</li>
      </ul>

      <h2>Step 4: Add Your First Credential (3 minutes)</h2>

      <h3>Store a Password</h3>
      <ol>
        <li>Open your newly created project</li>
        <li>Click "Add Credential"</li>
        <li>Fill in the details:
          <ul>
            <li><strong>Service Name:</strong> Gmail, GitHub, etc.</li>
            <li><strong>Username/Email:</strong> Your login identifier</li>
            <li><strong>Password:</strong> The password for this service</li>
            <li><strong>URL:</strong> Service website (auto-filled for popular services)</li>
            <li><strong>Notes:</strong> Any additional information</li>
          </ul>
        </li>
        <li>Add tags for easy searching (optional)</li>
        <li>Click "Save"</li>
      </ol>

      <h3>What Happens Behind the Scenes</h3>
      <p>
        When you save a credential:
      </p>
      <ol>
        <li>Your browser encrypts it using <a href="/blog/aes-256-encryption-standard">AES-256 encryption</a></li>
        <li>The encryption key is derived from your master password</li>
        <li>Only encrypted data is sent to our servers</li>
        <li>We never see your passwords in plaintext</li>
      </ol>

      <h2>Step 5: Install Browser Extension (2 minutes)</h2>

      <h3>Auto-Fill Convenience</h3>
      <p>
        The LockPulse browser extension makes accessing credentials seamless:
      </p>
      <ol>
        <li>Click your profile icon → Extensions</li>
        <li>Choose your browser (Chrome, Firefox, Edge, Safari)</li>
        <li>Click "Install Extension"</li>
        <li>Follow browser-specific installation steps</li>
        <li>Log in to the extension with your master password</li>
      </ol>

      <h3>Using the Extension</h3>
      <ul>
        <li>Visit a website (e.g., gmail.com)</li>
        <li>Click the LockPulse icon in your browser toolbar</li>
        <li>Select the credential you want to use</li>
        <li>Auto-fill login form</li>
      </ul>

      <h2>Step 6: Import Existing Passwords (Optional, 2 minutes)</h2>

      <h3>Migrate from Another Password Manager</h3>
      <p>
        If you're switching from another password manager:
      </p>
      <ol>
        <li>Go to Settings → Import</li>
        <li>Select your current password manager</li>
        <li>Upload exported file (CSV, JSON, etc.)</li>
        <li>Review import preview</li>
        <li>Click "Import"</li>
        <li>Immediately delete the export file</li>
      </ol>
      <p>
        Full details in our <a href="/blog/importing-passwords-guide">importing passwords guide</a>.
      </p>

      <h2>Next Steps</h2>

      <h3>Week 1: Build Muscle Memory</h3>
      <ul>
        <li>Practice typing your master password daily</li>
        <li>Add 5-10 important passwords to LockPulse</li>
        <li>Use the browser extension regularly</li>
        <li>Create additional projects as needed</li>
      </ul>

      <h3>Week 2: Full Migration</h3>
      <ul>
        <li>Import all passwords from old password manager</li>
        <li><a href="/blog/organizing-imported-passwords">Organize imported passwords</a> into projects</li>
        <li>Update weak or reused passwords</li>
        <li>Set up sharing for team credentials (if applicable)</li>
      </ul>

      <h3>Month 1: Establish Workflows</h3>
      <ul>
        <li>Configure <a href="/blog/credential-rotation-automation">credential rotation</a> reminders</li>
        <li>Share projects with team members (if needed)</li>
        <li>Review <a href="/blog/security-best-practices">security best practices</a></li>
        <li>Cancel your old password manager subscription</li>
      </ul>

      <h2>Common First-Time Questions</h2>

      <h3>How do I access credentials on mobile?</h3>
      <p>
        Download the LockPulse mobile app (iOS/Android). Log in with your master password and 2FA.
        All your projects and credentials sync automatically.
      </p>

      <h3>Can I change my master password later?</h3>
      <p>
        Yes! Go to Settings → Security → Change Master Password. You'll need your current master password.
        All credentials will be re-encrypted with the new password.
      </p>

      <h3>What if I'm not sure about a strong master password?</h3>
      <p>
        Take your time! Use our <a href="/blog/creating-strong-master-password">comprehensive guide</a>.
        It's better to spend 10 minutes choosing a great password than to rush and forget it later.
      </p>

      <h3>How do I share passwords with my team?</h3>
      <p>
        Create a shared project, add credentials, then invite team members via email. Each receives
        encrypted access. See <a href="/blog/secure-credential-sharing-teams">secure credential sharing</a>.
      </p>

      <h2>Pro Tips for New Users</h2>

      <h3>Tip 1: Start Small</h3>
      <p>
        Don't try to migrate everything on day one. Start with 10-20 important accounts. Build confidence
        with the system before going all-in.
      </p>

      <h3>Tip 2: Use Descriptive Names</h3>
      <p>
        Name credentials clearly: "Gmail - Personal", "AWS - Production", "GitHub - Work". Future you
        will thank present you.
      </p>

      <h3>Tip 3: Document in Notes</h3>
      <p>
        Use the notes field for important context:
      </p>
      <ul>
        <li>Security questions and answers</li>
        <li>2FA backup codes</li>
        <li>Account recovery emails</li>
        <li>Special login instructions</li>
      </ul>

      <h3>Tip 4: Regular Backups</h3>
      <p>
        Once a month, export an encrypted backup of your vault. Store it offline in a secure location.
        This protects against account lockout (though not master password loss).
      </p>

      <h2>Troubleshooting</h2>

      <h3>Can't log in?</h3>
      <ul>
        <li>Verify Caps Lock is off</li>
        <li>Try typing password in a text editor first</li>
        <li>Check for keyboard layout issues</li>
        <li>If using password hint, review it carefully</li>
      </ul>

      <h3>Extension not working?</h3>
      <ul>
        <li>Ensure you're logged in to the extension</li>
        <li>Check extension permissions</li>
        <li>Refresh the browser</li>
        <li>Reinstall extension if needed</li>
      </ul>

      <h3>Credential not auto-filling?</h3>
      <ul>
        <li>Verify URL matches saved credential</li>
        <li>Check username/email field matches</li>
        <li>Some sites have custom forms—use manual copy</li>
      </ul>

      <h2>Welcome to True Security</h2>
      <p>
        Congratulations! You've set up <strong>LockPulse</strong> and taken control of your password security.
        Your credentials are now protected by <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge encryption</a>,
        giving you mathematical certainty that only you can access them.
      </p>
      <p>
        Remember: your master password is precious. Choose wisely, practice it regularly, and never share it.
        With LockPulse, you're not just using a password manager—you're joining a community that values
        privacy, security, and personal data sovereignty.
      </p>
    </>
  ),
}
