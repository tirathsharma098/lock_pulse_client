import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'credential-rotation-automation',
  title: 'Credential Rotation Automation: Keep Security Fresh',
  description: 'Automate password rotation workflows for enhanced security.',
  readTime: '7 min read',
  date: '2024-12-02',
  tags: ['Automation', 'Security', 'DevOps'],
  relatedBlogs: [
    { slug: 'managing-aws-credentials-securely', title: 'Managing AWS Credentials' },
    { slug: 'database-password-management', title: 'Database Password Management' },
    { slug: 'security-automation-workflows', title: 'Security Automation Workflows' },
  ],
  content: () => (
    <>
      <h2>Why Credential Rotation Matters</h2>
      <p>
        Regular credential rotation limits the damage from compromised passwords. If a credential is leaked,
        rotation ensures it becomes useless quickly. <strong>LockPulse</strong> helps you implement and track
        systematic rotation schedules.
      </p>

      <h3>The Cost of Stale Credentials</h3>
      <p>
        Credentials that haven't been rotated in years pose serious risks:
      </p>
      <ul>
        <li>Former employees may still have access</li>
        <li>Leaked credentials remain valid indefinitely</li>
        <li>Compliance violations (many standards require rotation)</li>
        <li>Increased blast radius from security incidents</li>
      </ul>

      <h2>Rotation Schedules by Credential Type</h2>
      <p>
        Different credentials require different rotation frequencies:
      </p>

      <h3>Critical Production Credentials</h3>
      <ul>
        <li><strong>Production database passwords:</strong> Every 60 days</li>
        <li><strong>Production <a href="/blog/managing-aws-credentials-securely">AWS keys</a>:</strong> Every 90 days</li>
        <li><strong>Root/Admin accounts:</strong> Every 90 days</li>
        <li><strong>API keys for payment processing:</strong> Every 90 days</li>
      </ul>

      <h3>Development Credentials</h3>
      <ul>
        <li><strong>Dev/staging databases:</strong> Every 6 months</li>
        <li><strong>Test API keys:</strong> Annually or on team changes</li>
        <li><strong>Development service accounts:</strong> Every 6 months</li>
      </ul>

      <h3>User Credentials</h3>
      <ul>
        <li><strong>Service accounts:</strong> Every 90 days</li>
        <li><strong>Shared team credentials:</strong> When team membership changes</li>
        <li><strong>CI/CD credentials:</strong> Every 90 days</li>
      </ul>

      <h2>Manual Rotation Workflow with LockPulse</h2>
      <p>
        Here's a systematic approach to manual rotation:
      </p>

      <h3>Step 1: Plan the Rotation</h3>
      <ol>
        <li>Identify which credentials need rotation</li>
        <li>Schedule rotation during low-traffic periods</li>
        <li>Notify team members of planned rotation</li>
        <li>Prepare rollback plan in case of issues</li>
      </ol>

      <h3>Step 2: Generate New Credentials</h3>
      <ol>
        <li>Create new credential in the service (AWS, database, etc.)</li>
        <li>Test new credential in isolated environment</li>
        <li>Add new credential to LockPulse project</li>
        <li>Tag with rotation date and notes</li>
      </ol>

      <h3>Step 3: Update Applications</h3>
      <ol>
        <li>Update configuration with new credentials</li>
        <li>Deploy changes to staging first</li>
        <li>Verify functionality with new credentials</li>
        <li>Deploy to production</li>
      </ol>

      <h3>Step 4: Verify and Cleanup</h3>
      <ol>
        <li>Monitor application logs for errors</li>
        <li>Verify all services using new credentials</li>
        <li>Keep old credentials active for 24-48 hours</li>
        <li>Deactivate/delete old credentials</li>
        <li>Update LockPulse with rotation completion notes</li>
      </ol>

      <h2>Automation Strategies</h2>

      <h3>AWS Credentials Automation</h3>
      <p>
        For <a href="/blog/managing-aws-credentials-securely">AWS credentials</a>, use IAM policies and scripts:
      </p>
      <ul>
        <li>Use AWS Secrets Manager for automatic rotation</li>
        <li>Set up Lambda functions for rotation workflows</li>
        <li>Store rotation logs in LockPulse notes</li>
        <li>Alert on rotation failures</li>
      </ul>

      <h3>Database Password Automation</h3>
      <p>
        For <a href="/blog/database-password-management">database passwords</a>:
      </p>
      <ul>
        <li>Use database-native rotation features (RDS, Azure SQL)</li>
        <li>Implement zero-downtime rotation with dual passwords</li>
        <li>Test connections before switching</li>
        <li>Update LockPulse programmatically via API</li>
      </ul>

      <h3>API Key Rotation</h3>
      <p>
        Many services support multiple active keys:
      </p>
      <ol>
        <li>Generate second API key</li>
        <li>Add to LockPulse and deploy to applications</li>
        <li>Monitor for 24 hours</li>
        <li>Revoke first API key</li>
        <li>Zero downtime achieved</li>
      </ol>

      <h2>Rotation Tracking in LockPulse</h2>

      <h3>Using Tags and Notes</h3>
      <p>
        Track rotation status systematically:
      </p>
      <ul>
        <li><strong>Tags:</strong> <code>last-rotated-2024-12</code>, <code>rotation-due</code></li>
        <li><strong>Notes:</strong> Document rotation history and next scheduled date</li>
        <li><strong>Custom fields:</strong> Add "Next Rotation Date" field</li>
      </ul>

      <h3>Creating Rotation Reminders</h3>
      <p>
        Set up a rotation calendar:
      </p>
      <ul>
        <li>Monthly review of credentials due for rotation</li>
        <li>Quarterly audit of rotation compliance</li>
        <li>Alert team leads of upcoming rotations</li>
        <li>Track rotation completion rates</li>
      </ul>

      <h2>Team Coordination</h2>

      <h3>Rotation Ownership</h3>
      <p>
        Assign clear ownership for each credential type:
      </p>
      <ul>
        <li><strong>DevOps team:</strong> Infrastructure credentials</li>
        <li><strong>Backend team:</strong> Database and API credentials</li>
        <li><strong>Security team:</strong> Administrative and audit credentials</li>
      </ul>

      <h3>Communication Protocol</h3>
      <p>
        Before rotating shared credentials:
      </p>
      <ol>
        <li>Post rotation schedule in team chat</li>
        <li>Update LockPulse project notes with timeline</li>
        <li>Give 24-hour notice for production rotations</li>
        <li>Confirm completion with all stakeholders</li>
      </ol>

      <h2>Compliance and Auditing</h2>

      <h3>Meeting Compliance Requirements</h3>
      <p>
        Various frameworks mandate credential rotation:
      </p>
      <ul>
        <li><strong>PCI-DSS:</strong> Rotate every 90 days</li>
        <li><strong>SOC 2:</strong> Regular rotation with documented policy</li>
        <li><strong>HIPAA:</strong> Periodic password changes</li>
        <li><strong>ISO 27001:</strong> Access control review and rotation</li>
      </ul>

      <h3>Audit Trail</h3>
      <p>
        LockPulse's <a href="/blog/audit-logging-compliance">audit logging</a> automatically tracks:
      </p>
      <ul>
        <li>When credentials were added/modified</li>
        <li>Who performed the rotation</li>
        <li>Access history before and after rotation</li>
        <li>Compliance with rotation policies</li>
      </ul>

      <h2>Emergency Rotation</h2>

      <h3>When to Rotate Immediately</h3>
      <p>
        Some scenarios require emergency rotation:
      </p>
      <ul>
        <li>Suspected credential compromise</li>
        <li>Employee termination with credential access</li>
        <li>Accidental public exposure (GitHub, logs)</li>
        <li>Security incident or breach</li>
      </ul>

      <h3>Emergency Rotation Checklist</h3>
      <ol>
        <li>Identify all affected credentials</li>
        <li>Rotate immediately without waiting for maintenance window</li>
        <li>Notify all relevant team members</li>
        <li>Monitor for service disruptions</li>
        <li>Document incident and response</li>
        <li>Review how exposure occurred</li>
        <li>Implement preventive measures</li>
      </ol>

      <h2>Zero-Downtime Rotation Techniques</h2>

      <h3>Dual-Credential Strategy</h3>
      <p>
        For critical services, maintain two valid credentials:
      </p>
      <ol>
        <li>Generate new credential (Credential B)</li>
        <li>Deploy both credentials to applications</li>
        <li>Verify applications use both successfully</li>
        <li>Remove old credential (Credential A) from applications</li>
        <li>Revoke Credential A after grace period</li>
      </ol>

      <h3>Blue-Green Rotation</h3>
      <p>
        For database connections:
      </p>
      <ol>
        <li>Create new user with new password (Green)</li>
        <li>Grant same permissions as old user</li>
        <li>Update connection strings to new user</li>
        <li>Deploy and verify</li>
        <li>Remove old user (Blue)</li>
      </ol>

      <h2>Rotation Best Practices</h2>
      <ul>
        <li>✅ Never rotate all credentials simultaneously</li>
        <li>✅ Test in staging before production rotation</li>
        <li>✅ Keep old credentials active briefly for rollback</li>
        <li>✅ Document rotation in LockPulse notes</li>
        <li>✅ Verify application functionality after rotation</li>
        <li>✅ Use automation where possible</li>
        <li>✅ Coordinate with team before shared credential rotation</li>
        <li>✅ Monitor for errors after rotation</li>
      </ul>

      <h2>Common Rotation Mistakes</h2>
      <ul>
        <li>❌ Rotating without notification</li>
        <li>❌ Deleting old credentials immediately</li>
        <li>❌ Not testing new credentials first</li>
        <li>❌ Forgetting to update all application instances</li>
        <li>❌ Rotating during peak traffic</li>
        <li>❌ Not documenting rotation process</li>
      </ul>
    </>
  ),
}
