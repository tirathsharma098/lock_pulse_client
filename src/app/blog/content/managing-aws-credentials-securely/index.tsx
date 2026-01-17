import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'managing-aws-credentials-securely',
  title: 'Managing AWS Credentials Securely with LockPulse',
  description: 'Best practices for storing and sharing AWS access keys, secret keys, and IAM credentials.',
  readTime: '7 min read',
  date: '2024-12-08',
  tags: ['AWS', 'Cloud Security', 'Best Practices'],
  relatedBlogs: [
    { slug: 'api-key-management', title: 'API Key Management Best Practices' },
    { slug: 'project-based-credential-management', title: 'Project-Based Credential Management' },
    { slug: 'team-credential-management', title: 'Team Credential Management' },
  ],
  content: () => (
    <>
      <h2>The AWS Credential Challenge</h2>
      <p>
        AWS credentials are powerful—they grant access to your entire cloud infrastructure. Storing them securely
        is critical. <strong>LockPulse Projects</strong> provide a zero-knowledge solution for AWS credential management.
      </p>

      <h3>Types of AWS Credentials to Manage</h3>
      <ul>
        <li><strong>Access Keys:</strong> Programmatic access credentials</li>
        <li><strong>Secret Keys:</strong> Used with access keys for API calls</li>
        <li><strong>IAM User Passwords:</strong> Console access credentials</li>
        <li><strong>MFA Devices:</strong> Recovery codes and backup keys</li>
        <li><strong>Root Account Credentials:</strong> Most sensitive, rarely used</li>
      </ul>

      <h3>Organizing AWS Credentials by Environment</h3>
      <p>
        Create separate <strong>LockPulse Projects</strong> for each environment:
      </p>
      <ul>
        <li><strong>Development Project:</strong> Dev account credentials</li>
        <li><strong>Staging Project:</strong> Staging environment keys</li>
        <li><strong>Production Project:</strong> Critical production access</li>
      </ul>
      <p>
        This separation follows the principle of least privilege and makes <Link href="/blog/managing-multiple-environments">
        managing multiple environments</Link> easier.
      </p>

      <h2>Team Access to AWS Credentials</h2>
      <p>
        When sharing AWS credentials with your team, <strong>LockPulse</strong> ensures each member receives
        encrypted credentials they can decrypt with their own master password. This is covered in detail in our
        <Link href="/blog/secure-credential-sharing-teams">secure credential sharing guide</Link>.
      </p>

      <h3>Rotation Best Practices</h3>
      <p>
        AWS recommends rotating access keys every 90 days. With LockPulse:
      </p>
      <ol>
        <li>Generate new AWS keys in IAM console</li>
        <li>Update credentials in your project</li>
        <li>Test new credentials</li>
        <li>Deactivate old keys</li>
        <li>Delete old keys after verification</li>
      </ol>

      <h2>Audit Logging</h2>
      <p>
        LockPulse tracks when credentials are accessed (without seeing the plaintext). Combined with AWS CloudTrail,
        you have complete visibility into who accessed what and when.
      </p>
    </>
  ),
}
