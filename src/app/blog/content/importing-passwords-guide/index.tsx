import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'importing-passwords-guide',
  title: 'Importing Passwords to LockPulse: Complete Migration Guide',
  description: 'How to import passwords from other password managers and browsers.',
  readTime: '5 min read',
  date: '2024-11-27',
  tags: ['Guide', 'Migration', 'Getting Started'],
  relatedBlogs: [
    { slug: 'getting-started-lockpulse', title: 'Getting Started with LockPulse' },
    { slug: 'project-based-credential-management', title: 'Project-Based Management' },
    { slug: 'organizing-imported-passwords', title: 'Organizing Imported Passwords' },
  ],
  content: () => (
    <>
      <h2>Migrating to LockPulse Made Easy</h2>
      <p>
        Switching password managers can feel daunting, but LockPulse makes it simple. This guide walks you
        through importing passwords from popular password managers and browsers while maintaining security
        throughout the process.
      </p>

      <h3>Before You Begin</h3>
      <p>
        Preparation steps:
      </p>
      <ul>
        <li>Create your <strong>LockPulse account</strong> with a strong <a href="/blog/creating-strong-master-password">master password</a></li>
        <li>Export passwords from your current password manager</li>
        <li>Ensure exports are from a secure, private device</li>
        <li>Plan your <a href="/blog/project-based-credential-management">project organization</a></li>
      </ul>

      <h2>Supported Import Sources</h2>
      <p>
        LockPulse supports imports from:
      </p>

      <h3>Password Managers</h3>
      <ul>
        <li>LastPass (.csv)</li>
        <li>1Password (.csv, .1pif)</li>
        <li>Bitwarden (.json)</li>
        <li>Dashlane (.csv)</li>
        <li>KeePass (.xml)</li>
        <li>Chrome Password Manager (.csv)</li>
        <li>Firefox Password Manager (.csv)</li>
      </ul>

      <h3>Browser Exports</h3>
      <ul>
        <li>Google Chrome</li>
        <li>Mozilla Firefox</li>
        <li>Microsoft Edge</li>
        <li>Safari</li>
      </ul>

      <h2>Step-by-Step Import Process</h2>

      <h3>Step 1: Export From Current Password Manager</h3>
      <p>
        <strong>Chrome Example:</strong>
      </p>
      <ol>
        <li>Open Chrome and go to Settings</li>
        <li>Navigate to Passwords</li>
        <li>Click the three-dot menu next to "Saved Passwords"</li>
        <li>Select "Export passwords"</li>
        <li>Authenticate and save the CSV file</li>
      </ol>

      <p>
        <strong>LastPass Example:</strong>
      </p>
      <ol>
        <li>Log in to LastPass vault</li>
        <li>Go to Account Options → Advanced → Export</li>
        <li>Enter your master password</li>
        <li>Save the CSV file to a secure location</li>
      </ol>

      <h3>Step 2: Import to LockPulse</h3>
      <ol>
        <li>Log in to your LockPulse account</li>
        <li>Navigate to Settings → Import</li>
        <li>Select your source (e.g., "Chrome CSV")</li>
        <li>Upload the exported file</li>
        <li>Review the preview of credentials to be imported</li>
        <li>Click "Import" to complete the process</li>
      </ol>

      <h3>Step 3: Secure the Export File</h3>
      <p>
        <strong>Critical:</strong> Your export file contains unencrypted passwords!
      </p>
      <ul>
        <li>Delete the export file immediately after import</li>
        <li>Empty your computer's recycle bin/trash</li>
        <li>If possible, use secure file deletion tools</li>
        <li>Never email or store export files in the cloud</li>
      </ul>

      <h2>Handling Import Errors</h2>

      <h3>Common Issues and Solutions</h3>
      <p>
        <strong>Duplicate Entries:</strong>
      </p>
      <ul>
        <li>LockPulse detects duplicates and prompts for action</li>
        <li>Choose to skip, merge, or keep both</li>
      </ul>

      <p>
        <strong>Malformed CSV:</strong>
      </p>
      <ul>
        <li>Ensure export is from a supported source</li>
        <li>Check for special characters in passwords</li>
        <li>Try exporting again if file appears corrupted</li>
      </ul>

      <p>
        <strong>Missing Fields:</strong>
      </p>
      <ul>
        <li>Some fields may not translate between managers</li>
        <li>Review imported credentials and add missing details manually</li>
      </ul>

      <h2>Post-Import Organization</h2>
      <p>
        After importing, you'll have all credentials in a default location. Now organize them:
      </p>

      <h3>Create Projects</h3>
      <ol>
        <li>Create projects for different contexts (Work, Personal, Finance, etc.)</li>
        <li>Move credentials to appropriate projects</li>
        <li>Delete any outdated or duplicate entries</li>
      </ol>
      <p>
        See <a href="/blog/organizing-imported-passwords">organizing imported passwords</a> for detailed strategies.
      </p>

      <h3>Add Missing Information</h3>
      <ul>
        <li>Update weak passwords</li>
        <li>Add notes or tags</li>
        <li>Verify URLs are correct</li>
        <li>Add 2FA backup codes if applicable</li>
      </ul>

      <h2>Importing from Multiple Sources</h2>
      <p>
        If you have passwords scattered across multiple places:
      </p>
      <ol>
        <li>Import from your primary password manager first</li>
        <li>Then import browser-saved passwords</li>
        <li>LockPulse will flag potential duplicates</li>
        <li>Review and merge as needed</li>
      </ol>

      <h3>Bulk Operations</h3>
      <p>
        After importing hundreds of passwords:
      </p>
      <ul>
        <li>Use tags to categorize quickly</li>
        <li>Bulk move credentials to projects</li>
        <li>Run security audit to find weak passwords</li>
        <li>Identify reused passwords for updating</li>
      </ul>

      <h2>Verifying Import Success</h2>
      <p>
        Before deleting your old password manager:
      </p>
      <ol>
        <li>Compare entry counts (old vs new)</li>
        <li>Test logging in to critical accounts</li>
        <li>Verify important credentials imported correctly</li>
        <li>Keep old password manager for 1-2 weeks as backup</li>
      </ol>

      <h2>Migrating Team Credentials</h2>
      <p>
        For team migrations:
      </p>
      <ol>
        <li>Import shared credentials to a dedicated project</li>
        <li>Share the project with team members</li>
        <li>Each member imports their personal credentials separately</li>
        <li>Establish new <a href="/blog/team-credential-management">team workflows</a></li>
      </ol>

      <h3>Security During Migration</h3>
      <ul>
        <li>Perform imports on trusted, private networks</li>
        <li>Never import on public WiFi</li>
        <li>Use a secure, updated browser</li>
        <li>Enable 2FA on LockPulse before importing</li>
      </ul>

      <h2>After Migration: Next Steps</h2>
      <p>
        Once you've successfully imported and organized:
      </p>
      <ul>
        <li>Update weak or reused passwords</li>
        <li>Set up <a href="/blog/credential-rotation-automation">credential rotation</a> schedules</li>
        <li>Configure browser extension for auto-fill</li>
        <li>Share necessary projects with team members</li>
        <li>Cancel your old password manager subscription</li>
      </ul>

      <h3>Welcome to Zero-Knowledge Security</h3>
      <p>
        You've successfully migrated to <strong>LockPulse</strong>. Your credentials are now protected by
        <a href="/blog/what-is-zero-knowledge-password-manager">zero-knowledge encryption</a>, giving you
        complete control and ultimate security.
      </p>
    </>
  ),
}
