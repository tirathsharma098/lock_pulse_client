import { BlogPost } from '../../types'
import Link from 'next/link'

export const blog: BlogPost = {
  slug: 'credential-tagging-strategies',
  title: 'Credential Tagging Strategies for Better Organization',
  description: 'Use tags and labels to enhance credential discoverability in LockPulse.',
  readTime: '5 min read',
  date: '2024-11-24',
  tags: ['Organization', 'Productivity', 'Tips'],
  relatedBlogs: [
    { slug: 'service-level-credential-organization', title: 'Service-Level Organization' },
    { slug: 'project-based-credential-management', title: 'Project-Based Management' },
    { slug: 'organizing-imported-passwords', title: 'Organizing Imported Passwords' },
  ],
  content: () => (
    <>
      <h2>Why Tags Matter</h2>
      <p>
        Projects provide structure, but tags offer flexibility. While a credential can only live in one project,
        it can have multiple tags. This creates powerful cross-cutting organization in <strong>LockPulse</strong>,
        making credentials discoverable from multiple perspectives.
      </p>

      <h3>Tags vs Projects: Complementary Systems</h3>
      <ul>
        <li><strong>Projects:</strong> Primary organization, hierarchical, one per credential</li>
        <li><strong>Tags:</strong> Secondary attributes, flat, multiple per credential</li>
        <li><strong>Together:</strong> Project defines what it is, tags describe characteristics</li>
      </ul>

      <h2>Essential Tag Categories</h2>

      <h3>Category 1: Type Tags</h3>
      <p>
        Describe what kind of credential:
      </p>
      <ul>
        <li><code>email</code> - Email accounts</li>
        <li><code>social</code> - Social media</li>
        <li><code>banking</code> - Financial institutions</li>
        <li><code>cloud</code> - Cloud service providers</li>
        <li><code>database</code> - Database credentials</li>
        <li><code>api</code> - API keys and tokens</li>
        <li><code>ssh</code> - SSH keys and server access</li>
        <li><code>vpn</code> - VPN credentials</li>
      </ul>

      <h3>Category 2: Priority Tags</h3>
      <p>
        Indicate importance level:
      </p>
      <ul>
        <li><code>critical</code> - Cannot lose access (email, master accounts)</li>
        <li><code>important</code> - Frequently used, significant if lost</li>
        <li><code>standard</code> - Regular accounts</li>
        <li><code>low-priority</code> - Rarely used, easily recoverable</li>
      </ul>

      <h3>Category 3: Security Status Tags</h3>
      <p>
        Track security state:
      </p>
      <ul>
        <li><code>2fa-enabled</code> - Has two-factor authentication</li>
        <li><code>no-2fa</code> - Missing 2FA, should enable</li>
        <li><code>strong-password</code> - Generated, 16+ characters</li>
        <li><code>weak-password</code> - Needs strengthening</li>
        <li><code>password-reused</code> - Flag for rotation</li>
        <li><code>compromised</code> - Known breach, urgent action needed</li>
      </ul>

      <h3>Category 4: Action Tags</h3>
      <p>
        Track required actions:
      </p>
      <ul>
        <li><code>needs-update</code> - Password should be changed</li>
        <li><code>rotation-due</code> - Scheduled rotation needed</li>
        <li><code>verify-access</code> - Test if still works</li>
        <li><code>delete-soon</code> - Plan to remove</li>
        <li><code>review-needed</code> - Requires attention</li>
      </ul>

      <h3>Category 5: Environment Tags</h3>
      <p>
        For developers and DevOps:
      </p>
      <ul>
        <li><code>production</code> - Live system credentials</li>
        <li><code>staging</code> - Pre-production environment</li>
        <li><code>development</code> - Dev environment</li>
        <li><code>test</code> - Testing purposes only</li>
        <li><code>local</code> - Local development</li>
      </ul>
      <p>
        Related: <Link href="/blog/managing-multiple-environments">Managing multiple environments</Link>.
      </p>

      <h3>Category 6: Access Tags</h3>
      <p>
        Track sharing and permissions:
      </p>
      <ul>
        <li><code>shared</code> - Shared with team members</li>
        <li><code>personal</code> - Only for your use</li>
        <li><code>admin-access</code> - Administrative privileges</li>
        <li><code>read-only</code> - View-only access</li>
        <li><code>team-wide</code> - Available to entire team</li>
      </ul>

      <h2>Tagging Best Practices</h2>

      <h3>Naming Conventions</h3>
      <ul>
        <li><strong>Lowercase only:</strong> Easier to type and search</li>
        <li><strong>Use hyphens:</strong> <code>high-priority</code> not <code>high_priority</code></li>
        <li><strong>Be concise:</strong> <code>2fa</code> not <code>two-factor-authentication</code></li>
        <li><strong>Consistent abbreviations:</strong> Always <code>db</code> or always <code>database</code></li>
        <li><strong>No special characters:</strong> Except hyphens and numbers</li>
      </ul>

      <h3>Tag Quantity Guidelines</h3>
      <ul>
        <li><strong>2-5 tags per credential:</strong> Sweet spot for usability</li>
        <li><strong>Avoid tag spam:</strong> Too many tags becomes noise</li>
        <li><strong>Remove redundant tags:</strong> Don't tag "banking" if project is "Banking Accounts"</li>
      </ul>

      <h3>Tag Maintenance</h3>
      <ul>
        <li>Review tags monthly</li>
        <li>Merge similar tags (<code>important</code> and <code>high-priority</code>)</li>
        <li>Delete unused tags</li>
        <li>Update tags when credential status changes</li>
      </ul>

      <h2>Advanced Tagging Strategies</h2>

      <h3>Time-Based Tags</h3>
      <p>
        Track temporal information:
      </p>
      <ul>
        <li><code>expires-2024-12</code> - Credential expiration</li>
        <li><code>last-rotated-2024-q4</code> - Rotation tracking</li>
        <li><code>added-2024</code> - When credential was created</li>
        <li><code>subscription-annual</code> - Renewal frequency</li>
      </ul>

      <h3>Compliance Tags</h3>
      <p>
        For regulatory requirements:
      </p>
      <ul>
        <li><code>pci-dss</code> - PCI compliance required</li>
        <li><code>hipaa</code> - HIPAA regulated</li>
        <li><code>sox</code> - Sarbanes-Oxley compliance</li>
        <li><code>gdpr</code> - GDPR data processing</li>
        <li><code>audit-required</code> - Must track access</li>
      </ul>

      <h3>Cost Tags</h3>
      <p>
        Track subscription costs:
      </p>
      <ul>
        <li><code>paid-monthly</code> - Monthly subscription</li>
        <li><code>paid-annually</code> - Yearly billing</li>
        <li><code>free-tier</code> - No cost</li>
        <li><code>trial</code> - Temporary trial period</li>
        <li><code>high-cost</code> - Expensive service</li>
      </ul>

      <h3>Ownership Tags</h3>
      <p>
        Assign responsibility:
      </p>
      <ul>
        <li><code>owner-john</code> - Specific person responsible</li>
        <li><code>team-devops</code> - Team ownership</li>
        <li><code>department-it</code> - Department responsibility</li>
        <li><code>vendor-managed</code> - External party manages</li>
      </ul>

      <h2>Tagging Workflows</h2>

      <h3>When Adding New Credentials</h3>
      <ol>
        <li>Add to appropriate project</li>
        <li>Tag with type (<code>email</code>, <code>cloud</code>, etc.)</li>
        <li>Tag with priority (<code>critical</code>, <code>important</code>)</li>
        <li>Tag with security status (<code>2fa-enabled</code>)</li>
        <li>Add environment tag if applicable (<code>production</code>)</li>
      </ol>

      <h3>After Security Audit</h3>
      <p>
        Tag credentials based on audit results:
      </p>
      <ul>
        <li>Weak passwords → <code>needs-update</code></li>
        <li>Reused passwords → <code>password-reused</code></li>
        <li>Breached passwords → <code>compromised</code></li>
        <li>Missing 2FA → <code>no-2fa</code></li>
      </ul>

      <h3>During Credential Rotation</h3>
      <p>
        Update tags when rotating:
      </p>
      <ol>
        <li>Remove <code>rotation-due</code> tag</li>
        <li>Add <code>last-rotated-2024-12</code> tag</li>
        <li>Update <code>strong-password</code> if generated new one</li>
        <li>Document rotation in notes</li>
      </ol>

      <h2>Tag-Based Workflows</h2>

      <h3>Weekly Security Review</h3>
      <p>
        Use tags for systematic review:
      </p>
      <ol>
        <li>Filter by <code>rotation-due</code> - Rotate these credentials</li>
        <li>Filter by <code>needs-update</code> - Update weak passwords</li>
        <li>Filter by <code>no-2fa</code> - Enable 2FA on these accounts</li>
        <li>Filter by <code>compromised</code> - Emergency rotation needed</li>
      </ol>

      <h3>Team Onboarding</h3>
      <p>
        For new team members:
      </p>
      <ul>
        <li>Filter by <code>team-wide</code> - Share these immediately</li>
        <li>Filter by <code>critical</code> + <code>shared</code> - Essential team credentials</li>
        <li>Filter by <code>personal</code> - Don't share these</li>
      </ul>

      <h3>Compliance Reporting</h3>
      <p>
        Generate compliance reports:
      </p>
      <ul>
        <li>Filter by <code>pci-dss</code> - PCI compliance credentials</li>
        <li>Filter by <code>audit-required</code> - Credentials needing access logs</li>
        <li>Filter by <code>production</code> + <code>critical</code> - High-risk credentials</li>
      </ul>

      <h2>Searching with Tags</h2>

      <h3>Single Tag Searches</h3>
      <ul>
        <li>Search: <code>tag:production</code> - All production credentials</li>
        <li>Search: <code>tag:2fa-enabled</code> - Accounts with 2FA</li>
        <li>Search: <code>tag:critical</code> - Most important accounts</li>
      </ul>

      <h3>Combined Tag Searches</h3>
      <ul>
        <li>Search: <code>tag:production AND tag:database</code> - Production databases</li>
        <li>Search: <code>tag:critical AND tag:no-2fa</code> - Urgent 2FA needed</li>
        <li>Search: <code>tag:shared AND tag:rotation-due</code> - Team credentials to rotate</li>
      </ul>

      <h3>Exclusion Searches</h3>
      <ul>
        <li>Search: <code>tag:production NOT tag:2fa-enabled</code> - Production without 2FA</li>
        <li>Search: <code>tag:important NOT tag:strong-password</code> - Important weak passwords</li>
      </ul>

      <h2>Tag Hierarchies</h2>

      <h3>Nested Tag Concepts</h3>
      <p>
        While tags are flat, you can simulate hierarchy:
      </p>
      <ul>
        <li><code>cloud-aws</code>, <code>cloud-azure</code>, <code>cloud-gcp</code></li>
        <li><code>db-postgres</code>, <code>db-mysql</code>, <code>db-mongodb</code></li>
        <li><code>priority-high</code>, <code>priority-medium</code>, <code>priority-low</code></li>
      </ul>

      <h3>Benefits of Hierarchical Tags</h3>
      <ul>
        <li>Search for <code>cloud</code> finds all cloud credentials</li>
        <li>Search for <code>cloud-aws</code> finds only AWS</li>
        <li>Maintains organization at multiple levels</li>
      </ul>

      <h2>Automated Tagging</h2>

      <h3>Auto-Tag Rules</h3>
      <p>
        Set up rules for automatic tagging:
      </p>
      <ul>
        <li>If URL contains "aws.amazon.com" → add <code>cloud-aws</code></li>
        <li>If password length &lt; 12 → add <code>weak-password</code></li>
        <li>If 2FA not configured → add <code>no-2fa</code></li>
        <li>If created &gt; 90 days ago → add <code>rotation-due</code></li>
      </ul>

      <h3>Bulk Auto-Tagging</h3>
      <p>
        Apply tags to existing credentials:
      </p>
      <ol>
        <li>Run security audit</li>
        <li>LockPulse analyzes all credentials</li>
        <li>Automatically suggests tags based on analysis</li>
        <li>Review and approve suggestions</li>
        <li>Bulk apply approved tags</li>
      </ol>

      <h2>Tag Analytics</h2>

      <h3>Tag Cloud Visualization</h3>
      <p>
        See which tags are most common:
      </p>
      <ul>
        <li>Larger text = more credentials with this tag</li>
        <li>Identify over-tagged categories</li>
        <li>Find underutilized tags for cleanup</li>
      </ul>

      <h3>Tag-Based Reports</h3>
      <ul>
        <li><strong>Security Report:</strong> Count of <code>compromised</code>, <code>weak-password</code>, <code>no-2fa</code></li>
        <li><strong>Rotation Report:</strong> Count of <code>rotation-due</code> by project</li>
        <li><strong>Environment Report:</strong> Credentials per environment tag</li>
      </ul>

      <h2>Team Tagging Standards</h2>

      <h3>Establish Team Conventions</h3>
      <p>
        Document tagging standards:
      </p>
      <ul>
        <li>Required tags for all credentials</li>
        <li>Approved tag list (prevent tag sprawl)</li>
        <li>Tag naming conventions</li>
        <li>When to create new tags</li>
        <li>Tag review schedule</li>
      </ul>

      <h3>Tag Governance</h3>
      <ul>
        <li>Assign tag owners for each category</li>
        <li>Regular tag audits (monthly)</li>
        <li>Merge duplicate or similar tags</li>
        <li>Deprecate unused tags</li>
        <li>Update documentation when tags change</li>
      </ul>

      <h2>Common Tagging Mistakes</h2>

      <h3>What to Avoid</h3>
      <ul>
        <li>❌ Too many tags per credential (over 7)</li>
        <li>❌ Inconsistent tag names (<code>2FA</code> vs <code>2fa</code> vs <code>two-factor</code>)</li>
        <li>❌ Redundant tags (project already indicates this)</li>
        <li>❌ Never updating tags when status changes</li>
        <li>❌ Creating new tags without checking existing ones</li>
        <li>❌ Using full sentences as tags</li>
      </ul>

      <h3>Best Practices</h3>
      <ul>
        <li>✅ 2-5 tags per credential</li>
        <li>✅ Lowercase, hyphenated tag names</li>
        <li>✅ Tags complement projects, don't duplicate</li>
        <li>✅ Update tags when credential status changes</li>
        <li>✅ Check existing tags before creating new ones</li>
        <li>✅ Short, descriptive tag names</li>
      </ul>

      <h2>Tag Migration Strategy</h2>

      <h3>Starting Fresh</h3>
      <p>
        If your tags are a mess:
      </p>
      <ol>
        <li>List all existing tags</li>
        <li>Define standard tag categories</li>
        <li>Create approved tag list</li>
        <li>Map old tags to new standard tags</li>
        <li>Bulk update credentials with new tags</li>
        <li>Delete deprecated tags</li>
      </ol>

      <h3>Gradual Tag Improvement</h3>
      <p>
        Improve tags over time:
      </p>
      <ul>
        <li>Fix tags as you access credentials</li>
        <li>Tag new credentials correctly from day one</li>
        <li>Weekly: Fix tags on 10 credentials</li>
        <li>Monthly: Review and standardize one tag category</li>
      </ul>

      <h2>Integration with Other Systems</h2>

      <h3>API Access to Tags</h3>
      <p>
        Use LockPulse API for automation:
      </p>
      <ul>
        <li>Sync tags with external systems</li>
        <li>Generate reports based on tags</li>
        <li>Automate tag updates based on external events</li>
        <li>Export tagged credentials for backup</li>
      </ul>

      <h3>Webhook Triggers</h3>
      <p>
        Trigger actions when tags change:
      </p>
      <ul>
        <li>When <code>rotation-due</code> added → Create ticket in Jira</li>
        <li>When <code>compromised</code> added → Send alert to security team</li>
        <li>When <code>production</code> added → Require additional approval</li>
      </ul>

      <h2>Success Metrics</h2>

      <h3>Well-Tagged Vault Indicators</h3>
      <ul>
        <li>Can find any credential in under 10 seconds</li>
        <li>All credentials have 2-5 relevant tags</li>
        <li>Tag names are consistent and clear</li>
        <li>Security audit completed in minutes using tags</li>
        <li>Team members understand and use tags effectively</li>
      </ul>

      <h2>Conclusion</h2>
      <p>
        Effective tagging transforms <strong>LockPulse</strong> from a secure credential store into a powerful
        credential management system. Combined with <Link href="/blog/project-based-credential-management">project-based organization</Link>,
        tags provide the flexibility to find, manage, and secure credentials at scale.
      </p>
      <p>
        Start simple with basic type and priority tags, then gradually add more sophisticated tagging as your
        needs grow. The investment in good tagging practices pays dividends in time saved and security improved.
      </p>
    </>
  ),
}
