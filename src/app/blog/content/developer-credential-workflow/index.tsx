import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'developer-credential-workflow',
  title: 'Developer Credential Workflow: From Local to Production',
  description: 'Best practices for managing development credentials throughout the software lifecycle.',
  readTime: '6 min read',
  date: '2024-11-26',
  tags: ['Development', 'Workflow', 'Best Practices'],
  relatedBlogs: [
    { slug: 'github-token-security', title: 'GitHub Token Security' },
    { slug: 'managing-multiple-environments', title: 'Managing Multiple Environments' },
    { slug: 'ci-cd-credential-security', title: 'CI/CD Credential Security' },
  ],
  content: () => (
    <>
      <h2>The Developer Credential Lifecycle</h2>
      <p>
        Developers need credentials at every stage: local development, testing, staging, and production.
        Managing these securely without slowing down development is challenging. <strong>LockPulse</strong>
        provides a workflow that balances security and productivity.
      </p>

      <h3>Common Developer Credential Types</h3>
      <ul>
        <li><strong><Link href="/blog/github-token-security">GitHub tokens</Link>:</strong> Repository access and automation</li>
        <li><strong>Database credentials:</strong> Local, dev, staging, prod databases</li>
        <li><strong>API keys:</strong> Third-party services (Stripe, SendGrid, etc.)</li>
        <li><strong>Cloud credentials:</strong> AWS, Azure, GCP access</li>
        <li><strong>SSH keys:</strong> Server and deployment access</li>
      </ul>

      <h2>Local Development Setup</h2>

      <h3>Step 1: Personal LockPulse Vault</h3>
      <p>
        Every developer should have their own LockPulse account:
      </p>
      <ol>
        <li>Create account with strong <Link href="/blog/creating-strong-master-password">master password</Link></li>
        <li>Enable 2FA for additional security</li>
        <li>Install browser extension for easy access</li>
      </ol>

      <h3>Step 2: Access Team Projects</h3>
      <p>
        Team lead shares relevant projects:
      </p>
      <ul>
        <li><strong>Development Project:</strong> Access to dev environment credentials</li>
        <li><strong>Service Accounts Project:</strong> Shared testing accounts</li>
        <li><strong>Third-Party APIs Project:</strong> Test mode API keys</li>
      </ul>

      <h3>Step 3: Local Environment Configuration</h3>
      <p>
        Use environment variables, never hardcode:
      </p>
      <ul>
        <li>Create <code>.env.local</code> file (add to <code>.gitignore</code>)</li>
        <li>Retrieve credentials from LockPulse</li>
        <li>Paste into environment file</li>
        <li>Never commit credentials to version control</li>
      </ul>

      <h2>Development Environment Best Practices</h2>

      <h3>Separate Personal and Shared Credentials</h3>
      <p>
        Create distinct LockPulse projects:
      </p>
      <ul>
        <li><strong>Personal Project:</strong> Your GitHub token, SSH keys, personal services</li>
        <li><strong>Team Dev Project:</strong> Shared dev database, test API keys</li>
        <li><strong>Local Services Project:</strong> Local PostgreSQL, Redis, etc.</li>
      </ul>

      <h3>Using .env Files Securely</h3>
      <p>
        Environment file structure:
      </p>
      <ul>
        <li><code>.env.example</code>: Template with placeholder values (committed)</li>
        <li><code>.env.local</code>: Actual credentials from LockPulse (never committed)</li>
        <li><code>.env.test</code>: Test environment credentials</li>
      </ul>

      <h2>Testing and Staging Workflow</h2>

      <h3>Accessing Staging Credentials</h3>
      <p>
        Request access through proper channels:
      </p>
      <ol>
        <li>Submit access request to team lead</li>
        <li>Team lead grants staging project access</li>
        <li>Retrieve staging credentials from LockPulse</li>
        <li>Configure staging environment variables</li>
      </ol>

      <h3>Testing with Real APIs</h3>
      <p>
        When testing third-party integrations:
      </p>
      <ul>
        <li>Always use test/sandbox API keys first</li>
        <li>Store test keys separately from production</li>
        <li>Monitor API usage to avoid rate limits</li>
        <li>Document test key limitations in LockPulse notes</li>
      </ul>

      <h2>CI/CD Integration</h2>

      <h3>Credentials in Pipelines</h3>
      <p>
        For automated testing and deployment:
      </p>
      <ul>
        <li>Store credentials in CI/CD secrets (GitHub Actions, GitLab CI)</li>
        <li>Reference LockPulse for credential source of truth</li>
        <li>Rotate CI/CD credentials regularly</li>
        <li>Use separate credentials for each pipeline</li>
      </ul>
      <p>
        Learn more about <Link href="/blog/ci-cd-credential-security">CI/CD credential security</Link>.
      </p>
      <p>
        Use GitHub's fine-grained PATs to limit token scope. Store the permission details in LockPulse alongside
        the token. This helps team members understand what each token can access. Learn more about
        <Link href="/blog/developer-credential-workflow">developer credential workflows</Link>.
      </p>

      <h3>Deployment Credentials</h3>
      <p>
        For automated deployments:
      </p>
      <ol>
        <li>Create service account for deployment</li>
        <li>Grant minimum necessary permissions</li>
        <li>Store in LockPulse CI/CD project</li>
        <li>Rotate every 90 days</li>
        <li>Monitor deployment credential usage</li>
      </ol>

      <h2>Production Access Protocol</h2>

      <h3>Strict Access Controls</h3>
      <p>
        Production credentials require special handling:
      </p>
      <ul>
        <li>Only senior engineers and DevOps have access</li>
        <li>Require justification for access requests</li>
        <li>Time-limited access for specific tasks</li>
        <li>All access logged and reviewed</li>
      </ul>

      <h3>Read-Only vs Write Access</h3>
      <p>
        Implement graduated access:
      </p>
      <ul>
        <li><strong>Read-only:</strong> Debugging, log analysis</li>
        <li><strong>Write access:</strong> Only for authorized deployments</li>
        <li><strong>Admin access:</strong> Emergency use only</li>
      </ul>

      <h2>Credential Organization by Project</h2>

      <h3>Example: E-commerce Application</h3>
      <p>
        Organize in <strong>LockPulse Projects</strong>:
      </p>

      <p><strong>Personal Project</strong></p>
      <ul>
        <li>GitHub personal access token</li>
        <li>Local database password</li>
        <li>SSH key for personal servers</li>
      </ul>

      <p><strong>E-commerce Dev Project</strong></p>
      <ul>
        <li>Dev database credentials</li>
        <li>Stripe test API keys</li>
        <li>SendGrid test account</li>
        <li>Dev AWS access keys</li>
      </ul>

      <p><strong>E-commerce Staging Project</strong></p>
      <ul>
        <li>Staging database (read-only for most devs)</li>
        <li>Staging API keys</li>
        <li>Staging cloud resources</li>
      </ul>

      <p><strong>E-commerce Production Project</strong></p>
      <ul>
        <li>Production database (DevOps only)</li>
        <li>Live Stripe keys (restricted)</li>
        <li>Production AWS (admin only)</li>
      </ul>

      <h2>Common Developer Mistakes</h2>

      <h3>Mistake 1: Committing Credentials</h3>
      <p>
        Prevention:
      </p>
      <ul>
        <li>Use <code>.gitignore</code> for all credential files</li>
        <li>Install git hooks to scan for secrets</li>
        <li>Use tools like <code>git-secrets</code></li>
        <li>Enable GitHub secret scanning</li>
      </ul>

      <h3>Mistake 2: Using Production in Development</h3>
      <p>
        Prevention:
      </p>
      <ul>
        <li>Clear naming conventions in LockPulse</li>
        <li>Color-code projects (dev=green, prod=red)</li>
        <li>Separate LockPulse projects entirely</li>
        <li>Require approval for production access</li>
      </ul>

      <h3>Mistake 3: Sharing Credentials Insecurely</h3>
      <p>
        Never share via:
      </p>
      <ul>
        <li>❌ Slack messages</li>
        <li>❌ Email</li>
        <li>❌ Text files in repos</li>
        <li>❌ Sticky notes</li>
      </ul>
      <p>
        Always share via:
      </p>
      <ul>
        <li>✅ <strong>LockPulse project sharing</strong></li>
        <li>✅ Encrypted, temporary links (for one-time sharing)</li>
      </ul>

      <h2>Onboarding New Developers</h2>

      <h3>Day 1 Checklist</h3>
      <ol>
        <li>Create LockPulse account</li>
        <li>Install browser extension</li>
        <li>Request access to team projects</li>
        <li>Clone repositories</li>
        <li>Set up local environment with credentials from LockPulse</li>
        <li>Verify access to dev database and services</li>
      </ol>

      <h3>Week 1 Review</h3>
      <ul>
        <li>Verify all credentials working</li>
        <li>Review security best practices</li>
        <li>Confirm .gitignore configured correctly</li>
        <li>Check no credentials committed to repos</li>
      </ul>

      <h2>Credential Rotation for Developers</h2>

      <h3>Personal Credentials</h3>
      <p>
        Rotate regularly:
      </p>
      <ul>
        <li><strong>GitHub tokens:</strong> Every 6 months</li>
        <li><strong>SSH keys:</strong> Annually</li>
        <li><strong>Local database:</strong> When changing machines</li>
      </ul>

      <h3>Shared Development Credentials</h3>
      <p>
        Team-wide rotation:
      </p>
      <ul>
        <li>Schedule rotation during sprint planning</li>
        <li>Notify all developers 24 hours in advance</li>
        <li>Update LockPulse project with new credentials</li>
        <li>Verify all developers can access</li>
      </ul>

      <h2>Debugging Production Issues</h2>

      <h3>Read-Only Access Pattern</h3>
      <p>
        When debugging production:
      </p>
      <ol>
        <li>Request temporary read-only credentials</li>
        <li>Access granted for specific time window (4 hours)</li>
        <li>Retrieve from LockPulse production project (viewer role)</li>
        <li>Perform investigation</li>
        <li>Access automatically revoked after window</li>
        <li>Actions logged for compliance</li>
      </ol>

      <h3>Emergency Production Access</h3>
      <p>
        For critical incidents:
      </p>
      <ul>
        <li>On-call engineer requests emergency access</li>
        <li>Manager approves via documented process</li>
        <li>Full access granted temporarily</li>
        <li>All actions logged in LockPulse audit trail</li>
        <li>Post-incident review of access</li>
      </ul>

      <h2>Tools Integration</h2>

      <h3>IDE Integration</h3>
      <p>
        Access credentials from your IDE:
      </p>
      <ul>
        <li>Use LockPulse browser extension copy feature</li>
        <li>Paste into environment configuration</li>
        <li>Use IDE plugins for environment management</li>
        <li>Never store credentials in IDE settings</li>
      </ul>

      <h3>CLI Tools</h3>
      <p>
        For command-line work:
      </p>
      <ul>
        <li>Export credentials to environment variables</li>
        <li>Use shell scripts to load from LockPulse</li>
        <li>Clear environment after session</li>
        <li>Never log credentials in terminal history</li>
      </ul>

      <h2>Security Checklist for Developers</h2>
      <ul>
        <li>✅ All credentials stored in LockPulse</li>
        <li>✅ .gitignore includes all credential files</li>
        <li>✅ No hardcoded credentials in code</li>
        <li>✅ Separate credentials for each environment</li>
        <li>✅ Never share credentials via chat/email</li>
        <li>✅ Rotate personal credentials regularly</li>
        <li>✅ Use minimum necessary access level</li>
        <li>✅ Report suspected credential exposure immediately</li>
      </ul>
    </>
  ),
}
