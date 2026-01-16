import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'managing-multiple-environments',
  title: 'Managing Multiple Environments: Dev, Staging, Production',
  description: 'Organize credentials across different deployment environments with LockPulse Projects.',
  readTime: '5 min read',
  date: '2024-11-30',
  tags: ['DevOps', 'Organization', 'Best Practices'],
  relatedBlogs: [
    { slug: 'project-based-credential-management', title: 'Project-Based Management' },
    { slug: 'database-password-management', title: 'Database Password Management' },
    { slug: 'credential-rotation-automation', title: 'Credential Rotation' },
  ],
  content: () => (
    <>
      <h2>The Multi-Environment Challenge</h2>
      <p>
        Modern software development involves multiple environments: development, staging, QA, production.
        Each environment needs separate credentials. Mixing them creates security risks and deployment errors.
        <strong>LockPulse Projects</strong> provide the perfect solution.
      </p>

      <h3>Why Separate Environments Matter</h3>
      <p>
        Using production credentials in development is dangerous:
      </p>
      <ul>
        <li>Accidental production changes during testing</li>
        <li>Developers having unnecessary production access</li>
        <li>Compliance violations (PCI-DSS, HIPAA require separation)</li>
        <li>Leaked dev credentials compromising production</li>
      </ul>

      <h2>Organizing with LockPulse Projects</h2>
      <p>
        Create a dedicated <strong>LockPulse Project</strong> for each environment:
      </p>

      <h3>Development Environment Project</h3>
      <p>
        Store credentials for local development and dev servers:
      </p>
      <ul>
        <li>Local database passwords</li>
        <li>Dev AWS account keys</li>
        <li>Test API keys (Stripe test mode, etc.)</li>
        <li>Development service credentials</li>
      </ul>
      <p>
        <strong>Access:</strong> All developers. These credentials can be less restrictive since they
        access non-production data.
      </p>

      <h3>Staging Environment Project</h3>
      <p>
        Staging mirrors production but uses separate credentials:
      </p>
      <ul>
        <li>Staging database passwords</li>
        <li>Staging AWS resources</li>
        <li>Test payment gateway keys</li>
        <li>Pre-production service accounts</li>
      </ul>
      <p>
        <strong>Access:</strong> Developers and QA team. Use this for final testing before production deployment.
      </p>

      <h3>Production Environment Project</h3>
      <p>
        The most restricted project with live system credentials:
      </p>
      <ul>
        <li>Production <a href="/blog/database-password-management">database passwords</a></li>
        <li>Live <a href="/blog/managing-aws-credentials-securely">AWS credentials</a></li>
        <li>Real payment API keys</li>
        <li>Critical service accounts</li>
      </ul>
      <p>
        <strong>Access:</strong> Limited to senior engineers and DevOps team. Implement <a href="/blog/access-control-best-practices">strict access controls</a>.
      </p>

      <h2>Environment-Specific Best Practices</h2>

      <h3>Color Coding and Labels</h3>
      <p>
        Use LockPulse's tagging system to visually distinguish environments:
      </p>
      <ul>
        <li>🟢 Development: Green tags</li>
        <li>🟡 Staging: Yellow tags</li>
        <li>🔴 Production: Red tags</li>
      </ul>

      <h3>Naming Conventions</h3>
      <p>
        Establish clear naming patterns:
      </p>
      <ul>
        <li><code>DEV - AWS Access Key</code></li>
        <li><code>STAGING - Database Password</code></li>
        <li><code>PROD - Stripe API Key</code></li>
      </ul>

      <h2>Credential Rotation by Environment</h2>
      <p>
        Different environments require different rotation schedules:
      </p>
      <ul>
        <li><strong>Development:</strong> Rotate every 6 months or when team changes</li>
        <li><strong>Staging:</strong> Rotate quarterly</li>
        <li><strong>Production:</strong> Rotate every 90 days (or more frequently)</li>
      </ul>
      <p>
        Learn more about <a href="/blog/credential-rotation-automation">credential rotation automation</a>.
      </p>

      <h3>Deployment Workflows</h3>
      <p>
        When deploying to a new environment:
      </p>
      <ol>
        <li>Retrieve credentials from the appropriate LockPulse project</li>
        <li>Never copy production credentials to staging/dev</li>
        <li>Use environment variables, never hardcode</li>
        <li>Verify you're using correct environment before deployment</li>
      </ol>

      <h2>CI/CD Integration</h2>
      <p>
        For automated deployments, reference LockPulse projects in your pipeline:
      </p>
      <ul>
        <li>Dev branch deploys use Development Project credentials</li>
        <li>Main branch deploys use Production Project credentials</li>
        <li>Feature branches can use Staging Project for testing</li>
      </ul>
      <p>
        See <a href="/blog/ci-cd-credential-security">CI/CD credential security</a> for detailed integration strategies.
      </p>

      <h3>Emergency Access</h3>
      <p>
        Define break-glass procedures for production access:
      </p>
      <ul>
        <li>Who can access production credentials in emergencies</li>
        <li>Logging requirements for emergency access</li>
        <li>Post-incident credential rotation</li>
      </ul>

      <h2>Compliance Considerations</h2>
      <p>
        Many compliance frameworks require environment separation:
      </p>
      <ul>
        <li><strong>PCI-DSS:</strong> Requires separate dev/prod environments</li>
        <li><strong>SOC 2:</strong> Mandates access controls by environment</li>
        <li><strong>HIPAA:</strong> Restricts production PHI access</li>
      </ul>
      <p>
        LockPulse's project-based organization and <a href="/blog/audit-logging-compliance">audit logging</a>
        help satisfy these requirements.
      </p>
    </>
  ),
}
