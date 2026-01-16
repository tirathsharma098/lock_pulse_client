import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'first-project-setup',
  title: 'Setting Up Your First Project in LockPulse',
  description: 'Step-by-step tutorial for creating and organizing your first credential project.',
  readTime: '4 min read',
  date: '2024-12-22',
  tags: ['Tutorial', 'Getting Started', 'Projects'],
  relatedBlogs: [
    { slug: 'getting-started-lockpulse', title: 'Getting Started with LockPulse' },
    { slug: 'project-based-credential-management', title: 'Project-Based Management' },
    { slug: 'organizing-imported-passwords', title: 'Organizing Imported Passwords' },
  ],
  content: () => (
    <>
      <h2>Your First LockPulse Project</h2>
      <p>
        You've created your <strong>LockPulse</strong> account and chosen a strong master password. Now it's
        time to create your first project and start organizing credentials. This tutorial walks you through
        the process step-by-step.
      </p>

      <h3>What You'll Learn</h3>
      <ul>
        <li>How to create a project</li>
        <li>Best practices for naming and organizing</li>
        <li>Adding your first credentials</li>
        <li>Using tags and notes effectively</li>
        <li>Sharing projects with others (optional)</li>
      </ul>

      <h2>Step 1: Understanding Projects</h2>

      <h3>What Are Projects?</h3>
      <p>
        <strong>Projects</strong> are containers for related credentials. Instead of one long list of passwords,
        you organize them by context. Learn more about <a href="/blog/project-based-credential-management">project-based credential management</a>.
      </p>

      <h3>Common Project Types</h3>
      <ul>
        <li><strong>Personal:</strong> Social media, email, shopping accounts</li>
        <li><strong>Work:</strong> Company accounts, tools, systems</li>
        <li><strong>Finance:</strong> Banking, investments, payment platforms</li>
        <li><strong>Development:</strong> GitHub, AWS, databases, APIs</li>
        <li><strong>Clients:</strong> Separate project per client (for agencies)</li>
      </ul>

      <h2>Step 2: Create Your First Project</h2>

      <h3>Access the Dashboard</h3>
      <ol>
        <li>Log in to LockPulse with your master password</li>
        <li>You'll land on the Dashboard view</li>
        <li>Click the <strong>"New Project"</strong> button (top right or center)</li>
      </ol>

      <h3>Project Creation Form</h3>
      <p>
        Fill in the project details:
      </p>

      <p><strong>Project Name</strong></p>
      <ul>
        <li>Be descriptive: "Personal Accounts" not just "Personal"</li>
        <li>Include context: "Work - DevOps Team" not just "Work"</li>
        <li>Example: "E-commerce Project - Production"</li>
      </ul>

      <p><strong>Description (Optional)</strong></p>
      <ul>
        <li>Brief explanation of what this project contains</li>
        <li>Example: "Production credentials for e-commerce platform including AWS, database, and payment APIs"</li>
        <li>Helpful for team members or future you</li>
      </ul>

      <p><strong>Color Tag</strong></p>
      <ul>
        <li>Choose a color for visual organization</li>
        <li>Suggestion: Green for personal, Blue for work, Red for production, Yellow for staging</li>
        <li>Creates visual hierarchy in project list</li>
      </ul>

      <p><strong>Icon (Optional)</strong></p>
      <ul>
        <li>Select an icon representing the project</li>
        <li>💼 for work, 🏠 for personal, 💰 for finance, 🔧 for development</li>
      </ul>

      <h3>Click "Create Project"</h3>
      <p>
        Your project is created and ready for credentials!
      </p>

      <h2>Step 3: Add Your First Credential</h2>

      <h3>Open Your Project</h3>
      <ol>
        <li>Click on your newly created project</li>
        <li>You'll see an empty credential list</li>
        <li>Click <strong>"Add Credential"</strong> button</li>
      </ol>

      <h3>Credential Information</h3>
      <p>
        Fill in the credential details:
      </p>

      <p><strong>Service Name</strong></p>
      <ul>
        <li>The service this credential is for (Gmail, GitHub, AWS, etc.)</li>
        <li>LockPulse auto-suggests common services</li>
        <li>Be specific: "Gmail - Personal" vs "Gmail - Work"</li>
      </ul>

      <p><strong>Username/Email</strong></p>
      <ul>
        <li>Your login identifier for this service</li>
        <li>Often an email address</li>
      </ul>

      <p><strong>Password</strong></p>
      <ul>
        <li>Paste existing password OR</li>
        <li>Click "Generate" for new random password</li>
        <li>Recommended: 16+ characters, mixed case, numbers, symbols</li>
      </ul>

      <p><strong>Website URL</strong></p>
      <ul>
        <li>Auto-filled for common services</li>
        <li>Enables browser extension auto-fill</li>
        <li>Include full URL: https://mail.google.com</li>
      </ul>

      <p><strong>Tags (Optional)</strong></p>
      <ul>
        <li>Add descriptive tags for searching</li>
        <li>Examples: "email", "2fa-enabled", "important"</li>
        <li>Multiple tags allowed</li>
      </ul>

      <p><strong>Notes (Optional)</strong></p>
      <ul>
        <li>Additional information about this credential</li>
        <li>Security questions and answers</li>
        <li>2FA backup codes</li>
        <li>Account recovery email</li>
      </ul>

      <h3>Save the Credential</h3>
      <p>
        Click <strong>"Save"</strong>. Your credential is encrypted using <a href="/blog/aes-256-encryption-standard">AES-256</a>
        and stored securely.
      </p>

      <h2>Step 4: Add More Credentials</h2>

      <h3>Building Your Project</h3>
      <p>
        Add 3-5 more credentials to populate your project:
      </p>
      <ul>
        <li>Most important accounts first</li>
        <li>Accounts you use daily</li>
        <li>High-value accounts (email, banking)</li>
      </ul>

      <h3>Organization Tips</h3>
      <ul>
        <li>Group related credentials in same project</li>
        <li>Use consistent naming conventions</li>
        <li>Add tags for easy filtering</li>
        <li>Document special requirements in notes</li>
      </ul>

      <h2>Step 5: Customize Your Project</h2>

      <h3>Project Settings</h3>
      <p>
        Access project settings (gear icon):
      </p>
      <ul>
        <li><strong>Rename:</strong> Update project name or description</li>
        <li><strong>Change color:</strong> Adjust visual organization</li>
        <li><strong>Set permissions:</strong> If sharing with team</li>
        <li><strong>Archive:</strong> Hide completed projects from main view</li>
      </ul>

      <h3>Sorting and Filtering</h3>
      <ul>
        <li>Sort credentials by name, date added, or last modified</li>
        <li>Filter by tags</li>
        <li>Search within project</li>
      </ul>

      <h2>Step 6: Using Your Credentials</h2>

      <h3>Browser Extension</h3>
      <p>
        Install LockPulse browser extension for easy access:
      </p>
      <ol>
        <li>Visit website you have credentials for</li>
        <li>Click LockPulse extension icon</li>
        <li>Select the credential</li>
        <li>Auto-fill login form</li>
      </ol>

      <h3>Manual Copy</h3>
      <ul>
        <li>Click credential to view details</li>
        <li>Click "Copy" button next to password</li>
        <li>Paste into login form</li>
        <li>Password auto-clears from clipboard after 30 seconds</li>
      </ul>

      <h2>Best Practices for Your First Project</h2>

      <h3>Naming Conventions</h3>
      <ul>
        <li>✅ "Gmail - Personal Account"</li>
        <li>✅ "AWS - Production Environment"</li>
        <li>✅ "GitHub - Work Repository"</li>
        <li>❌ "Email" (too vague)</li>
        <li>❌ "Password1" (meaningless)</li>
      </ul>

      <h3>Documentation</h3>
      <p>
        Use notes field effectively:
      </p>
      <ul>
        <li>Security question answers</li>
        <li>2FA backup codes (if applicable)</li>
        <li>Account recovery email</li>
        <li>Last password change date</li>
        <li>Subscription renewal date</li>
      </ul>

      <h3>Tagging Strategy</h3>
      <p>
        Develop consistent tagging:
      </p>
      <ul>
        <li><strong>Priority:</strong> "critical", "important", "low-priority"</li>
        <li><strong>Type:</strong> "email", "social", "banking", "work"</li>
        <li><strong>Status:</strong> "2fa-enabled", "needs-update", "shared"</li>
      </ul>

      <h2>Common First Project Scenarios</h2>

      <h3>Scenario 1: Personal User</h3>
      <p>
        Create "Personal Accounts" project:
      </p>
      <ul>
        <li>Primary email (Gmail, Outlook)</li>
        <li>Social media (Facebook, Twitter, Instagram)</li>
        <li>Shopping (Amazon, eBay)</li>
        <li>Entertainment (Netflix, Spotify)</li>
      </ul>

      <h3>Scenario 2: Developer</h3>
      <p>
        Create "Development Tools" project:
      </p>
      <ul>
        <li><a href="/blog/github-token-security">GitHub personal access token</a></li>
        <li><a href="/blog/managing-aws-credentials-securely">AWS credentials</a></li>
        <li>Database passwords (local dev)</li>
        <li>API keys for development</li>
      </ul>

      <h3>Scenario 3: Team Lead</h3>
      <p>
        Create "Team Shared Resources" project:
      </p>
      <ul>
        <li>Shared team accounts</li>
        <li>Development environment credentials</li>
        <li>Testing service accounts</li>
        <li>Documentation and wiki logins</li>
      </ul>

      <h2>Next Steps</h2>

      <h3>Create Additional Projects</h3>
      <p>
        Now that you've created your first project:
      </p>
      <ul>
        <li>Create project for work accounts</li>
        <li>Create project for financial accounts</li>
        <li>Separate projects for different contexts</li>
      </ul>

      <h3>Import Existing Passwords</h3>
      <p>
        If migrating from another password manager:
      </p>
      <ul>
        <li>Follow our <a href="/blog/importing-passwords-guide">import guide</a></li>
        <li>Then organize into projects</li>
        <li>See <a href="/blog/organizing-imported-passwords">organizing imported passwords</a></li>
      </ul>

      <h3>Share with Team</h3>
      <p>
        For team projects:
      </p>
      <ul>
        <li>Click "Share" button in project</li>
        <li>Enter team member email addresses</li>
        <li>Set permission level (Viewer, Editor, Admin)</li>
        <li>They receive encrypted access via <a href="/blog/secure-credential-sharing-teams">zero-knowledge sharing</a></li>
      </ul>

      <h2>Troubleshooting</h2>

      <h3>Can't find a credential?</h3>
      <ul>
        <li>Use search function (top of credential list)</li>
        <li>Filter by tags</li>
        <li>Check if in different project</li>
        <li>Verify credential was saved (check Recently Added)</li>
      </ul>

      <h3>Want to reorganize?</h3>
      <ul>
        <li>Move credentials between projects (drag and drop or move button)</li>
        <li>Rename projects anytime</li>
        <li>Merge similar projects</li>
        <li>Archive old projects</li>
      </ul>

      <h3>Sharing not working?</h3>
      <ul>
        <li>Verify team member has LockPulse account</li>
        <li>Check their email address is correct</li>
        <li>They must accept invitation via email</li>
        <li>Check their spam folder</li>
      </ul>

      <h2>Congratulations!</h2>
      <p>
        You've created your first <strong>LockPulse Project</strong> and added credentials securely. This
        foundation will scale as you add more projects and credentials. The <a href="/blog/project-based-credential-management">project-based organization</a>
        keeps everything manageable as your credential collection grows.
      </p>
      <p>
        Continue with our <a href="/blog/getting-started-lockpulse">getting started guide</a> to learn
        more about advanced features and best practices.
      </p>
    </>
  ),
}
