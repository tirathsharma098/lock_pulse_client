import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'ci-cd-credential-security',
  title: 'CI/CD Credential Security: Protecting Pipeline Secrets',
  description: 'How to securely manage credentials in continuous integration and deployment workflows.',
  readTime: '7 min read',
  date: '2024-11-29',
  tags: ['CI/CD', 'DevOps', 'Security'],
  relatedBlogs: [
    { slug: 'developer-credential-workflow', title: 'Developer Credential Workflow' },
    { slug: 'managing-aws-credentials-securely', title: 'Managing AWS Credentials' },
    { slug: 'github-token-security', title: 'GitHub Token Security' },
  ],
  content: () => (
    <>
      <h2>The CI/CD Credential Challenge</h2>
      <p>
        Continuous Integration and Deployment pipelines need access to sensitive credentials—database passwords,
        API keys, cloud provider credentials. Storing these securely while maintaining automation is a critical
        challenge. <strong>LockPulse</strong> provides a secure foundation for CI/CD credential management.
      </p>

      <h3>Common CI/CD Credentials</h3>
      <ul>
        <li><strong>Cloud Provider Credentials:</strong> <Link href="/blog/managing-aws-credentials-securely">AWS</Link>, Azure, GCP service accounts</li>
        <li><strong>Version Control Tokens:</strong> <Link href="/blog/github-token-security">GitHub</Link>, GitLab, Bitbucket access tokens</li>
        <li><strong>Container Registries:</strong> Docker Hub, ECR, GCR credentials</li>
        <li><strong>Deployment Keys:</strong> SSH keys for server access</li>
        <li><strong>Database Credentials:</strong> Connection strings for migrations and testing</li>
        <li><strong>API Keys:</strong> Third-party service credentials for testing</li>
      </ul>

      <h2>CI/CD Security Risks</h2>

      <h3>Why Traditional Approaches Fail</h3>
      <p>
        Common but insecure practices:
      </p>
      <ul>
        <li><strong>Hardcoded credentials:</strong> Directly in pipeline configuration files</li>
        <li><strong>Environment variables:</strong> Stored in plain text in CI/CD settings</li>
        <li><strong>Committed secrets:</strong> Accidentally pushed to version control</li>
        <li><strong>Shared credentials:</strong> Same keys used across all environments</li>
        <li><strong>No rotation:</strong> Credentials never changed</li>
      </ul>

      <h3>Attack Vectors</h3>
      <ul>
        <li>Pipeline logs exposing credentials</li>
        <li>Compromised CI/CD platform leaking secrets</li>
        <li>Malicious pull requests accessing secrets</li>
        <li>Former employees retaining pipeline access</li>
        <li>Supply chain attacks through dependencies</li>
      </ul>

      <h2>Secure CI/CD Architecture with LockPulse</h2>

      <h3>Principle 1: Separate Credentials by Pipeline</h3>
      <p>
        Create dedicated <strong>LockPulse Projects</strong> for each pipeline:
      </p>
      <ul>
        <li><strong>Build Pipeline Project:</strong> Credentials for compiling and testing</li>
        <li><strong>Deployment Pipeline Project:</strong> Deployment and release credentials</li>
        <li><strong>Integration Test Project:</strong> Test environment access</li>
      </ul>

      <h3>Principle 2: Minimal Privilege</h3>
      <p>
        Grant pipelines only what they need:
      </p>
      <ul>
        <li>Build pipelines: No production access</li>
        <li>Test pipelines: Read-only database access</li>
        <li>Deployment pipelines: Write access only during deployment windows</li>
      </ul>

      <h2>GitHub Actions Security</h2>

      <h3>Using GitHub Secrets with LockPulse</h3>
      <p>
        Workflow for secure credential management:
      </p>
      <ol>
        <li>Store credentials in <strong>LockPulse CI/CD Project</strong></li>
        <li>Copy credentials to GitHub Secrets manually (one-time setup)</li>
        <li>Reference secrets in workflow files</li>
        <li>Never commit actual values to repository</li>
        <li>Rotate credentials every 90 days via LockPulse</li>
      </ol>

      <h3>Example GitHub Actions Workflow</h3>
      <p>
        Secure workflow configuration:
      </p>
      <ul>
        <li>Use environment-specific secrets</li>
        <li>Limit secret exposure to specific jobs</li>
        <li>Never echo secrets in logs</li>
        <li>Use OIDC for cloud provider authentication when possible</li>
      </ul>

      <h3>GitHub Actions Best Practices</h3>
      <ul>
        <li><strong>Environment protection rules:</strong> Require approval for production deployments</li>
        <li><strong>Secret scanning:</strong> Enable GitHub secret scanning</li>
        <li><strong>Branch protection:</strong> Restrict who can trigger production workflows</li>
        <li><strong>Audit logs:</strong> Monitor secret access in LockPulse and GitHub</li>
      </ul>

      <h2>GitLab CI/CD Security</h2>

      <h3>Protected Variables</h3>
      <p>
        GitLab's credential security features:
      </p>
      <ul>
        <li><strong>Protected variables:</strong> Only available to protected branches</li>
        <li><strong>Masked variables:</strong> Hidden in job logs</li>
        <li><strong>Environment-scoped variables:</strong> Limited to specific environments</li>
        <li><strong>File-type variables:</strong> For certificates and keys</li>
      </ul>

      <h3>Integration Strategy</h3>
      <ol>
        <li>Organize credentials in LockPulse by environment</li>
        <li>Copy to GitLab CI/CD variables with appropriate scoping</li>
        <li>Use protected variables for production credentials</li>
        <li>Enable masking for all sensitive variables</li>
        <li>Document credential ownership in LockPulse notes</li>
      </ol>

      <h2>AWS CodePipeline & Secrets Manager</h2>

      <h3>Leveraging AWS Secrets Manager</h3>
      <p>
        For AWS-centric workflows:
      </p>
      <ol>
        <li>Store master credentials in <strong>LockPulse AWS Project</strong></li>
        <li>Create service-specific secrets in AWS Secrets Manager</li>
        <li>Grant pipeline IAM roles access to specific secrets</li>
        <li>Enable automatic rotation for database credentials</li>
        <li>Track rotation in LockPulse for compliance</li>
      </ol>

      <h3>CodePipeline Security</h3>
      <ul>
        <li>Use IAM roles instead of access keys when possible</li>
        <li>Implement least privilege IAM policies</li>
        <li>Store backup credentials in LockPulse</li>
        <li>Monitor AWS CloudTrail for secret access</li>
      </ul>

      <h2>Docker & Container Registry Security</h2>

      <h3>Container Registry Credentials</h3>
      <p>
        Secure approaches for container registries:
      </p>
      <ul>
        <li><strong>Docker Hub:</strong> Use access tokens instead of passwords</li>
        <li><strong>AWS ECR:</strong> Use IAM roles when possible</li>
        <li><strong>GCR/Artifact Registry:</strong> Service account keys</li>
        <li><strong>Azure ACR:</strong> Service principal credentials</li>
      </ul>

      <h3>Organizing Container Credentials</h3>
      <p>
        In <strong>LockPulse Container Registry Project</strong>:
      </p>
      <ul>
        <li>Separate credentials for public vs private registries</li>
        <li>Different tokens for read vs push access</li>
        <li>Environment-specific registry credentials</li>
        <li>Document rate limits and quotas</li>
      </ul>

      <h2>Database Credentials in CI/CD</h2>

      <h3>Test Database Access</h3>
      <p>
        For automated testing:
      </p>
      <ul>
        <li>Use dedicated test database users</li>
        <li>Grant only necessary permissions (CREATE, DROP for test DBs)</li>
        <li>Never use production database credentials in CI/CD</li>
        <li>Rotate test credentials quarterly</li>
      </ul>

      <h3>Migration Credentials</h3>
      <p>
        For database migrations in pipelines:
      </p>
      <ol>
        <li>Create migration-specific database user</li>
        <li>Grant schema modification permissions</li>
        <li>Store in environment-specific LockPulse project</li>
        <li>Use different credentials for each environment</li>
        <li>Audit migration credential usage</li>
      </ol>

      <h2>Credential Rotation in CI/CD</h2>

      <h3>Rotation Strategy</h3>
      <p>
        Systematic approach to CI/CD credential rotation:
      </p>
      <ol>
        <li><strong>Week 1:</strong> Generate new credentials in LockPulse</li>
        <li><strong>Week 2:</strong> Update staging pipeline with new credentials</li>
        <li><strong>Week 3:</strong> Test staging deployments thoroughly</li>
        <li><strong>Week 4:</strong> Update production pipeline</li>
        <li><strong>Week 5:</strong> Verify production deployments</li>
        <li><strong>Week 6:</strong> Revoke old credentials</li>
      </ol>

      <h3>Zero-Downtime Rotation</h3>
      <p>
        Techniques for rotating without breaking pipelines:
      </p>
      <ul>
        <li>Use services that support multiple active keys</li>
        <li>Deploy new credentials before revoking old ones</li>
        <li>Test pipelines with new credentials in feature branch</li>
        <li>Schedule rotation during low-activity periods</li>
      </ul>

      <h2>Preventing Credential Leaks</h2>

      <h3>Pre-commit Hooks</h3>
      <p>
        Prevent credentials from entering version control:
      </p>
      <ul>
        <li>Install git-secrets or similar tools</li>
        <li>Scan for patterns matching API keys, passwords</li>
        <li>Block commits containing potential secrets</li>
        <li>Educate team on secure practices</li>
      </ul>

      <h3>Log Sanitization</h3>
      <p>
        Ensure pipeline logs don't expose credentials:
      </p>
      <ul>
        <li>Never echo environment variables containing secrets</li>
        <li>Mask sensitive output in CI/CD platforms</li>
        <li>Review logs before making them public</li>
        <li>Use log scrubbing tools for automation</li>
      </ul>

      <h3>Secret Scanning</h3>
      <ul>
        <li>Enable GitHub/GitLab secret scanning</li>
        <li>Use tools like TruffleHog for repository scanning</li>
        <li>Scan Docker images for embedded secrets</li>
        <li>Alert on detected secrets immediately</li>
      </ul>

      <h2>Third-Party Service Integration</h2>

      <h3>API Keys for Testing</h3>
      <p>
        When integrating with external services:
      </p>
      <ul>
        <li>Always use test/sandbox API keys in pipelines</li>
        <li>Store in separate LockPulse project from production keys</li>
        <li>Document rate limits and quotas</li>
        <li>Monitor usage to prevent surprise bills</li>
      </ul>

      <h3>Payment Gateway Testing</h3>
      <p>
        For services like Stripe:
      </p>
      <ul>
        <li>Use test mode keys exclusively</li>
        <li>Never use live keys in CI/CD</li>
        <li>Create separate Stripe test account for CI/CD</li>
        <li>Rotate test keys if repository is public</li>
      </ul>

      <h2>Compliance and Auditing</h2>

      <h3>Audit Requirements</h3>
      <p>
        Many compliance frameworks require:
      </p>
      <ul>
        <li>Tracking who accessed pipeline credentials</li>
        <li>Logging when credentials were used</li>
        <li>Regular credential rotation evidence</li>
        <li>Access reviews for pipeline permissions</li>
      </ul>

      <h3>LockPulse Audit Trail</h3>
      <p>
        Maintain compliance with <Link href="/blog/audit-logging-compliance">LockPulse audit logging</Link>:
      </p>
      <ul>
        <li>Log when CI/CD credentials are retrieved</li>
        <li>Track rotation dates in credential notes</li>
        <li>Document pipeline access permissions</li>
        <li>Generate audit reports for compliance reviews</li>
      </ul>

      <h2>Emergency Procedures</h2>

      <h3>Credential Compromise Response</h3>
      <p>
        If pipeline credentials are leaked:
      </p>
      <ol>
        <li><strong>Immediate:</strong> Revoke compromised credentials</li>
        <li><strong>5 minutes:</strong> Generate replacement credentials in LockPulse</li>
        <li><strong>15 minutes:</strong> Update CI/CD platform with new credentials</li>
        <li><strong>30 minutes:</strong> Test all affected pipelines</li>
        <li><strong>1 hour:</strong> Review logs for unauthorized access</li>
        <li><strong>24 hours:</strong> Post-incident review and prevention measures</li>
      </ol>

      <h3>Pipeline Failure Handling</h3>
      <p>
        When credential rotation breaks pipelines:
      </p>
      <ul>
        <li>Keep old credentials active during transition</li>
        <li>Have rollback procedure documented</li>
        <li>Test credential changes in non-production first</li>
        <li>Maintain emergency contact list in LockPulse</li>
      </ul>

      <h2>Best Practices Summary</h2>
      <ul>
        <li>✅ Store CI/CD credentials in dedicated LockPulse projects</li>
        <li>✅ Use environment-specific credentials</li>
        <li>✅ Implement least privilege for pipeline access</li>
        <li>✅ Rotate credentials every 90 days</li>
        <li>✅ Never commit secrets to version control</li>
        <li>✅ Enable secret scanning on repositories</li>
        <li>✅ Mask secrets in pipeline logs</li>
        <li>✅ Use managed secrets services when available</li>
        <li>✅ Audit pipeline credential access regularly</li>
        <li>✅ Document emergency response procedures</li>
      </ul>

      <h2>Advanced Topics</h2>

      <h3>Dynamic Credential Generation</h3>
      <p>
        For maximum security, generate credentials on-demand:
      </p>
      <ul>
        <li>Use HashiCorp Vault for dynamic secrets</li>
        <li>Integrate with cloud provider IAM for temporary credentials</li>
        <li>Credentials expire after pipeline completion</li>
        <li>Store master vault credentials in LockPulse</li>
      </ul>

      <h3>Multi-Cloud Pipelines</h3>
      <p>
        Managing credentials across cloud providers:
      </p>
      <ul>
        <li>Separate LockPulse projects per cloud provider</li>
        <li>Use cloud-native secret management where possible</li>
        <li>Implement cross-cloud credential rotation</li>
        <li>Monitor usage across all providers</li>
      </ul>

      <p>
        For comprehensive DevOps credential management, see our guide on <Link href="/blog/developer-credential-workflow">developer credential workflows</Link>.
      </p>
    </>
  ),
}
