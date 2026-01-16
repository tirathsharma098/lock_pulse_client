import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'secure-credential-sharing-teams',
  title: 'Secure Credential Sharing for Teams Without Compromising Security',
  description: 'How LockPulse enables team collaboration while maintaining zero-knowledge principles.',
  readTime: '5 min read',
  date: '2024-12-12',
  tags: ['Collaboration', 'Teams', 'Security'],
  relatedBlogs: [
    { slug: 'project-based-credential-management', title: 'Project-Based Credential Management' },
    { slug: 'team-credential-management', title: 'Team Credential Management' },
    { slug: 'access-control-best-practices', title: 'Access Control Best Practices' },
  ],
  content: () => (
    <>
      <h2>The Team Credential Challenge</h2>
      <p>
        Sharing passwords via Slack, email, or sticky notes is dangerous. Yet teams need to collaborate on
        shared resources. <strong>LockPulse Projects</strong> solve this with secure, zero-knowledge credential sharing.
      </p>

      <h3>How Zero-Knowledge Sharing Works</h3>
      <p>
        When you share a credential with a team member in LockPulse:
      </p>
      <ol>
        <li>The credential is decrypted on your device using your master password</li>
        <li>It's re-encrypted using the recipient's public key</li>
        <li>The recipient decrypts it with their private key (derived from their master password)</li>
        <li>Our servers never see the plaintext credential</li>
      </ol>

      <h3>Project-Based Sharing</h3>
      <p>
        Instead of sharing individual passwords, share entire <strong>LockPulse Projects</strong>. This is perfect for:
      </p>
      <ul>
        <li><strong>Development teams:</strong> Share AWS, GitHub, and database credentials for a specific project</li>
        <li><strong>Client work:</strong> Give contractors access to project-specific tools</li>
        <li><strong>DevOps teams:</strong> Manage production credentials across team members</li>
      </ul>

      <h2>Granular Access Control</h2>
      <p>
        Control who sees what within your projects. Some team members might need read-only access, while others
        can edit credentials. LockPulse's <a href="/blog/access-control-best-practices">access control system</a>
        lets you define permissions at the project level.
      </p>

      <h3>Revocation is Instant</h3>
      <p>
        When a team member leaves or changes roles, revoke their access immediately. They lose access to shared
        projects, but their personal vault remains intact. This is crucial for <a href="/blog/team-credential-management">team credential management</a>.
      </p>

      <h2>Audit Trail</h2>
      <p>
        Every access and modification is logged (without exposing credential content). Know who accessed which
        credentials and when. This satisfies <a href="/blog/audit-logging-compliance">compliance requirements</a>
        while maintaining zero-knowledge security.
      </p>

      <h3>Real-World Example</h3>
      <p>
        Your development team needs access to staging environment credentials. Create a "Staging Project" in
        LockPulse, add <a href="/blog/managing-aws-credentials-securely">AWS credentials</a>, database passwords,
        and API keys. Share the project with your team. Everyone gets encrypted access without compromising security.
      </p>
    </>
  ),
}
