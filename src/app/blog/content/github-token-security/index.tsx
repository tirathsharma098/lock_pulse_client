import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'github-token-security',
  title: 'GitHub Token Security: Protecting Your Repository Access',
  description: 'Best practices for managing GitHub personal access tokens and deploy keys.',
  readTime: '5 min read',
  date: '2024-11-28',
  tags: ['GitHub', 'Development', 'Security'],
  relatedBlogs: [
    { slug: 'managing-aws-credentials-securely', title: 'Managing AWS Credentials' },
    { slug: 'api-key-management', title: 'API Key Management' },
    { slug: 'developer-credential-workflow', title: 'Developer Credential Workflow' },
  ],
  content: () => (
    <>
      <h2>GitHub Tokens: The Keys to Your Code</h2>
      <p>
        GitHub personal access tokens (PATs) grant programmatic access to your repositories. Leaked tokens
        can lead to code theft, unauthorized commits, or worse. <strong>LockPulse</strong> provides secure
        storage for these critical credentials.
      </p>

      <h3>Types of GitHub Credentials</h3>
      <ul>
        <li><strong>Personal Access Tokens:</strong> Fine-grained permissions for API access</li>
        <li><strong>Deploy Keys:</strong> SSH keys for automated deployments</li>
        <li><strong>OAuth App Tokens:</strong> Third-party application access</li>
        <li><strong>GitHub Actions Secrets:</strong> CI/CD workflow credentials</li>
      </ul>

      <h3>Organizing GitHub Tokens by Purpose</h3>
      <p>
        Create separate <strong>LockPulse Projects</strong> for different token uses:
      </p>
      <ul>
        <li><strong>Development Project:</strong> Tokens for local development</li>
        <li><strong>CI/CD Project:</strong> Tokens used in automated pipelines</li>
        <li><strong>Integration Project:</strong> Tokens for third-party integrations</li>
      </ul>

      <h2>Token Rotation Best Practices</h2>
      <p>
        GitHub recommends rotating tokens regularly. With LockPulse:
      </p>
      <ol>
        <li>Generate a new token in GitHub settings</li>
        <li>Update the token in your LockPulse project</li>
        <li>Test the new token in your applications</li>
        <li>Revoke the old token in GitHub</li>
        <li>Document the rotation in LockPulse notes</li>
      </ol>

      <h3>Fine-Grained Permissions</h3>
      <p>
        Use GitHub's fine-grained PATs to limit token scope. Store the permission details in LockPulse alongside
        the token. This helps team members understand what each token can access. Learn more about
        <Link href="/blog/developer-credential-workflow">developer credential workflows</Link>.
      </p>

      <h2>Sharing Tokens with Team</h2>
      <p>
        When multiple developers need the same GitHub token, share it via a <strong>LockPulse Project</strong>.
        Each team member gets encrypted access, and you can revoke access when needed. See our guide on
        <Link href="/blog/secure-credential-sharing-teams">secure credential sharing</Link>.
      </p>

      <h3>Integration with CI/CD</h3>
      <p>
        Store GitHub tokens in LockPulse and reference them in your CI/CD pipelines. This is safer than
        hardcoding tokens or using environment variables. Check out <Link href="/blog/ci-cd-credential-security">CI/CD credential security</Link>
        for detailed strategies.
      </p>
    </>
  ),
}
