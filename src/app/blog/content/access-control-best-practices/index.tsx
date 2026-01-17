import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'access-control-best-practices',
  title: 'Access Control Best Practices for Shared Credentials',
  description: 'How to manage who can access which credentials in team settings.',
  readTime: '6 min read',
  date: '2024-12-09',
  tags: ['Security', 'Teams', 'Best Practices'],
  relatedBlogs: [
    { slug: 'team-credential-management', title: 'Team Credential Management' },
    { slug: 'secure-credential-sharing-teams', title: 'Secure Credential Sharing' },
    { slug: 'audit-logging-compliance', title: 'Audit Logging and Compliance' },
  ],
  content: () => (
    <>
      <h2>The Principle of Least Privilege</h2>
      <p>
        Not everyone needs access to everything. The principle of least privilege states: grant the minimum
        access necessary for someone to do their job. <strong>LockPulse</strong> makes this easy with
        project-based access control.
      </p>

      <h3>Why Access Control Matters</h3>
      <ul>
        <li>Reduces risk of accidental credential exposure</li>
        <li>Limits damage from compromised accounts</li>
        <li>Meets compliance requirements (SOC 2, ISO 27001)</li>
        <li>Creates clear accountability</li>
        <li>Simplifies offboarding when team members leave</li>
      </ul>

      <h2>Organizing Access by Role</h2>
      <p>
        Structure your <strong>LockPulse Projects</strong> around job functions:
      </p>

      <h3>Development Team Access</h3>
      <ul>
        <li><strong>Access to:</strong> Development environment credentials</li>
        <li><strong>No access to:</strong> Production credentials</li>
        <li><strong>Example credentials:</strong> Dev databases, test API keys, staging servers</li>
      </ul>

      <h3>DevOps Team Access</h3>
      <ul>
        <li><strong>Access to:</strong> All environments (dev, staging, production)</li>
        <li><strong>Restrictions:</strong> Audit all production access</li>
        <li><strong>Example credentials:</strong> <Link href="/blog/managing-aws-credentials-securely">AWS credentials</Link>, deployment keys, server SSH</li>
      </ul>

      <h3>QA Team Access</h3>
      <ul>
        <li><strong>Access to:</strong> Staging and test environments</li>
        <li><strong>No access to:</strong> Production or infrastructure credentials</li>
        <li><strong>Example credentials:</strong> Test accounts, staging databases</li>
      </ul>

      <h2>Permission Levels</h2>
      <p>
        LockPulse supports granular permissions:
      </p>

      <h3>Viewer (Read-Only)</h3>
      <ul>
        <li>Can view and copy credentials</li>
        <li>Cannot edit or delete</li>
        <li>Perfect for junior team members or contractors</li>
      </ul>

      <h3>Editor</h3>
      <ul>
        <li>Can view, copy, and edit credentials</li>
        <li>Can add new credentials to shared projects</li>
        <li>Cannot delete the project or change sharing settings</li>
      </ul>

      <h3>Admin</h3>
      <ul>
        <li>Full control over the project</li>
        <li>Can manage team access</li>
        <li>Can delete credentials and projects</li>
        <li>Sees full audit logs</li>
      </ul>

      <h2>Access Control by Environment</h2>
      <p>
        Implement stricter controls as sensitivity increases:
      </p>

      <h3>Development Environment</h3>
      <ul>
        <li><strong>Access:</strong> All developers (Editor)</li>
        <li><strong>Rotation:</strong> Every 6 months</li>
        <li><strong>Audit:</strong> Quarterly review</li>
      </ul>

      <h3>Staging Environment</h3>
      <ul>
        <li><strong>Access:</strong> Senior developers, QA (Editor), Others (Viewer)</li>
        <li><strong>Rotation:</strong> Every 90 days</li>
        <li><strong>Audit:</strong> Monthly review</li>
      </ul>

      <h3>Production Environment</h3>
      <ul>
        <li><strong>Access:</strong> DevOps team only (Admin), Management (Viewer for emergencies)</li>
        <li><strong>Rotation:</strong> Every 60 days</li>
        <li><strong>Audit:</strong> Weekly review</li>
      </ul>

      <h2>Time-Based Access</h2>
      <p>
        Grant temporary access for specific tasks:
      </p>
      <ul>
        <li>Contractor needs production access for deployment</li>
        <li>Grant access for deployment window (4 hours)</li>
        <li>Automatically revoke after time expires</li>
        <li>All actions logged for compliance</li>
      </ul>

      <h3>Emergency Access Procedures</h3>
      <p>
        Define break-glass procedures:
      </p>
      <ol>
        <li>Emergency contact escalates to on-call engineer</li>
        <li>On-call temporarily grants elevated access</li>
        <li>Incident is logged with reason and duration</li>
        <li>Access automatically revoked after resolution</li>
        <li>Post-incident review of all actions taken</li>
      </ol>

      <h2>Onboarding New Team Members</h2>
      <p>
        Standardize access provisioning:
      </p>
      <ol>
        <li>New hire creates LockPulse account</li>
        <li>Manager requests access via standard form</li>
        <li>Admin grants role-appropriate project access</li>
        <li>New hire completes security training</li>
        <li>Access reviewed after 30-day probation</li>
      </ol>

      <h3>Onboarding Checklist</h3>
      <ul>
        <li>✅ LockPulse account created with strong master password</li>
        <li>✅ 2FA enabled</li>
        <li>✅ Browser extension installed</li>
        <li>✅ Access to development project granted</li>
        <li>✅ Security policies acknowledged</li>
        <li>✅ Initial password audit completed</li>
      </ul>

      <h2>Offboarding Process</h2>
      <p>
        When team members leave:
      </p>
      <ol>
        <li>Immediately revoke all project access</li>
        <li>Rotate any credentials they had access to</li>
        <li>Review audit logs for their last 30 days</li>
        <li>Document credential changes</li>
        <li>Update emergency contact lists</li>
      </ol>

      <h3>Offboarding Checklist</h3>
      <ul>
        <li>✅ All project access revoked</li>
        <li>✅ Shared credentials rotated</li>
        <li>✅ Audit logs reviewed</li>
        <li>✅ Personal vault remains accessible (their data)</li>
        <li>✅ Team lead notified of completion</li>
      </ul>

      <h2>Regular Access Reviews</h2>
      <p>
        Conduct periodic access audits:
      </p>

      <h3>Quarterly Reviews</h3>
      <ul>
        <li>List all team members and their access levels</li>
        <li>Verify access is still appropriate for current role</li>
        <li>Remove access for inactive accounts</li>
        <li>Document review findings</li>
      </ul>

      <h3>Role Change Reviews</h3>
      <p>
        When someone changes roles:
      </p>
      <ol>
        <li>Review current access against new role requirements</li>
        <li>Remove unnecessary access</li>
        <li>Add new access as needed</li>
        <li>Rotate sensitive credentials if reducing access</li>
      </ol>

      <h2>Compliance Alignment</h2>
      <p>
        LockPulse access controls help meet various compliance requirements:
      </p>

      <h3>SOC 2 Requirements</h3>
      <ul>
        <li>Documented access control policies</li>
        <li>Regular access reviews</li>
        <li>Audit trails of access changes</li>
        <li>Least privilege enforcement</li>
      </ul>

      <h3>ISO 27001 Requirements</h3>
      <ul>
        <li>Access control procedures</li>
        <li>User access provisioning</li>
        <li>Access right reviews</li>
        <li>Removal of access rights</li>
      </ul>

      <p>
        Learn more about <Link href="/blog/audit-logging-compliance">audit logging and compliance</Link>.
      </p>

      <h2>Monitoring and Alerts</h2>
      <p>
        Set up alerts for suspicious activities:
      </p>
      <ul>
        <li>New user added to production project</li>
        <li>Bulk credential exports</li>
        <li>Access from unusual locations</li>
        <li>Multiple failed login attempts</li>
        <li>Credential access outside business hours</li>
      </ul>

      <h3>Response Procedures</h3>
      <p>
        When alerts trigger:
      </p>
      <ol>
        <li>Investigate immediately</li>
        <li>Verify legitimacy with user</li>
        <li>If suspicious, revoke access and rotate credentials</li>
        <li>Document incident and resolution</li>
        <li>Review and update alert rules</li>
      </ol>

      <h2>Best Practices Summary</h2>
      <ul>
        <li>✅ Grant minimum necessary access</li>
        <li>✅ Use role-based access control</li>
        <li>✅ Separate production from dev/staging</li>
        <li>✅ Conduct regular access reviews</li>
        <li>✅ Document all access changes</li>
        <li>✅ Rotate credentials when reducing access</li>
        <li>✅ Monitor for suspicious activity</li>
        <li>✅ Train team on security policies</li>
      </ul>
    </>
  ),
}
