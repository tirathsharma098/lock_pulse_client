import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'database-password-management',
  title: 'Database Password Management: Security for Data at Rest',
  description: 'How to securely store and rotate database credentials across environments.',
  readTime: '6 min read',
  date: '2024-12-01',
  tags: ['Databases', 'Security', 'DevOps'],
  relatedBlogs: [
    { slug: 'managing-multiple-environments', title: 'Managing Multiple Environments' },
    { slug: 'credential-rotation-automation', title: 'Credential Rotation Automation' },
    { slug: 'project-based-credential-management', title: 'Project-Based Credential Management' },
  ],
  content: () => (
    <>
      <h2>Database Credentials: Your Data's First Line of Defense</h2>
      <p>
        Database passwords protect your most valuable asset—data. Compromised database credentials can lead
        to data breaches, compliance violations, and business disruption. <strong>LockPulse Projects</strong>
        ensure these critical passwords stay secure.
      </p>

      <h3>Types of Database Credentials</h3>
      <ul>
        <li><strong>Root/Admin Passwords:</strong> Full database access</li>
        <li><strong>Application User Credentials:</strong> Service-specific access</li>
        <li><strong>Read-Only User Passwords:</strong> Analytics and reporting</li>
        <li><strong>Backup User Credentials:</strong> Database backup operations</li>
        <li><strong>Connection Strings:</strong> Complete connection details</li>
      </ul>

      <h3>Organizing by Environment</h3>
      <p>
        Never mix development and production database passwords. Create separate <strong>LockPulse Projects</strong>:
      </p>
      <ul>
        <li><strong>Development DB Project:</strong> Local and dev environment credentials</li>
        <li><strong>Staging DB Project:</strong> Pre-production testing credentials</li>
        <li><strong>Production DB Project:</strong> Live system credentials (most restricted access)</li>
      </ul>
      <p>
        This aligns with <Link href="/blog/managing-multiple-environments">managing multiple environments</Link> best practices.
      </p>

      <h2>Password Rotation Strategy</h2>
      <p>
        Regular rotation reduces risk if credentials are compromised. With LockPulse:
      </p>
      <ol>
        <li>Create new database user with temporary password</li>
        <li>Grant appropriate permissions</li>
        <li>Update credential in LockPulse project</li>
        <li>Update application configurations</li>
        <li>Test database connectivity</li>
        <li>Remove old database user</li>
        <li>Document rotation in LockPulse notes</li>
      </ol>

      <h3>Connection String Management</h3>
      <p>
        Store complete connection strings, not just passwords. Include host, port, database name, and
        SSL requirements. LockPulse's secure notes feature is perfect for this structured data.
      </p>

      <h2>Team Access Control</h2>
      <p>
        Production database credentials should have minimal team access. Use <Link href="/blog/access-control-best-practices">access control best practices</Link>
        to limit who can view production passwords. Development databases can have broader access.
      </p>

      <h3>Compliance and Auditing</h3>
      <p>
        Many compliance frameworks (PCI-DSS, HIPAA, SOC 2) require tracking database credential access.
        LockPulse's <Link href="/blog/audit-logging-compliance">audit logging</Link> automatically tracks who
        accessed database credentials and when, without exposing the passwords themselves.
      </p>

      <h2>Emergency Access Procedures</h2>
      <p>
        Define clear procedures for emergency database access. Store emergency contact information and
        escalation procedures alongside credentials in LockPulse. See <Link href="/blog/emergency-access-planning">emergency access planning</Link>
        for comprehensive strategies.
      </p>
    </>
  ),
}
