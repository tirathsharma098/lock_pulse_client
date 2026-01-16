import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'service-level-credential-organization',
  title: 'Service-Level Credential Organization: Structure for Scale',
  description: 'Organize credentials by service type for easy management and retrieval.',
  readTime: '5 min read',
  date: '2024-12-04',
  tags: ['Organization', 'Best Practices', 'Workflow'],
  relatedBlogs: [
    { slug: 'project-based-credential-management', title: 'Project-Based Management' },
    { slug: 'api-key-management', title: 'API Key Management' },
    { slug: 'credential-tagging-strategies', title: 'Credential Tagging Strategies' },
  ],
  content: () => (
    <>
      <h2>Why Service-Level Organization?</h2>
      <p>
        As your credential collection grows, finding specific credentials becomes challenging. Organizing by
        service type creates logical groupings that mirror how you actually use credentials. <strong>LockPulse</strong>
        supports this with flexible project and tagging structures.
      </p>

      <h3>The Service Organization Model</h3>
      <p>
        Group credentials by the service or system they access:
      </p>
      <ul>
        <li><strong>Cloud Infrastructure:</strong> AWS, Azure, GCP credentials</li>
        <li><strong>Databases:</strong> PostgreSQL, MySQL, MongoDB passwords</li>
        <li><strong>Version Control:</strong> GitHub, GitLab, Bitbucket tokens</li>
        <li><strong>Communication:</strong> Email, SMS, messaging service keys</li>
        <li><strong>Payment Processing:</strong> Stripe, PayPal, payment gateway credentials</li>
      </ul>

      <h2>Creating Service-Based Projects</h2>

      <h3>Cloud Services Project</h3>
      <p>
        Organize all cloud provider credentials:
      </p>
      <ul>
        <li><a href="/blog/managing-aws-credentials-securely">AWS</a> access keys and secrets</li>
        <li>Azure subscription credentials</li>
        <li>Google Cloud service account keys</li>
        <li>DigitalOcean API tokens</li>
        <li>Cloudflare API keys</li>
      </ul>
      <p>
        <strong>Tagging strategy:</strong> <code>cloud-aws</code>, <code>cloud-azure</code>, <code>cloud-gcp</code>
      </p>

      <h3>Database Services Project</h3>
      <p>
        All <a href="/blog/database-password-management">database credentials</a> in one place:
      </p>
      <ul>
        <li>Production database passwords</li>
        <li>Staging database credentials</li>
        <li>Development database access</li>
        <li>Database admin accounts</li>
        <li>Backup service credentials</li>
      </ul>
      <p>
        <strong>Naming convention:</strong> <code>[ENV] - [DB_TYPE] - [PURPOSE]</code><br />
        Example: <code>PROD - PostgreSQL - Main Application</code>
      </p>

      <h3>API Services Project</h3>
      <p>
        Third-party <a href="/blog/api-key-management">API keys</a> organized by category:
      </p>
      <ul>
        <li><strong>Payment APIs:</strong> Stripe, PayPal, Square</li>
        <li><strong>Communication APIs:</strong> SendGrid, Twilio, Mailgun</li>
        <li><strong>Analytics APIs:</strong> Google Analytics, Mixpanel</li>
        <li><strong>Social APIs:</strong> Twitter, Facebook, LinkedIn</li>
        <li><strong>Utility APIs:</strong> Weather, maps, translation services</li>
      </ul>

      <h2>Hierarchical Organization Structure</h2>

      <h3>Three-Tier System</h3>
      <p>
        Implement a logical hierarchy:
      </p>

      <p><strong>Tier 1: Service Category (Project)</strong></p>
      <ul>
        <li>Cloud Infrastructure</li>
        <li>Databases</li>
        <li>Third-Party APIs</li>
      </ul>

      <p><strong>Tier 2: Specific Service (Tag)</strong></p>
      <ul>
        <li>AWS</li>
        <li>PostgreSQL</li>
        <li>Stripe</li>
      </ul>

      <p><strong>Tier 3: Environment (Tag)</strong></p>
      <ul>
        <li>Production</li>
        <li>Staging</li>
        <li>Development</li>
      </ul>

      <h3>Example Organization</h3>
      <p>
        <strong>Project:</strong> Cloud Infrastructure<br />
        <strong>Credential:</strong> AWS Production Access Key<br />
        <strong>Tags:</strong> <code>aws</code>, <code>production</code>, <code>infrastructure</code><br />
        <strong>Notes:</strong> IAM user: prod-deploy, Created: 2024-01, Last rotated: 2024-12
      </p>

      <h2>Service-Specific Organization Patterns</h2>

      <h3>GitHub/Version Control Services</h3>
      <p>
        Organize <a href="/blog/github-token-security">GitHub tokens</a> by purpose:
      </p>
      <ul>
        <li><strong>Personal tokens:</strong> Individual developer access</li>
        <li><strong>CI/CD tokens:</strong> Automated pipeline access</li>
        <li><strong>Deploy tokens:</strong> Deployment-specific access</li>
        <li><strong>Read-only tokens:</strong> Reporting and monitoring</li>
      </ul>

      <h3>Email Services</h3>
      <p>
        Separate by function:
      </p>
      <ul>
        <li><strong>Transactional email:</strong> SendGrid for user notifications</li>
        <li><strong>Marketing email:</strong> Mailchimp for campaigns</li>
        <li><strong>Internal email:</strong> SMTP credentials for alerts</li>
      </ul>

      <h3>Monitoring and Logging Services</h3>
      <ul>
        <li><strong>Application monitoring:</strong> Datadog, New Relic</li>
        <li><strong>Error tracking:</strong> Sentry, Rollbar</li>
        <li><strong>Log aggregation:</strong> LogDNA, Papertrail</li>
        <li><strong>Uptime monitoring:</strong> Pingdom, UptimeRobot</li>
      </ul>

      <h2>Cross-Service Credentials</h2>

      <h3>Handling Multi-Service Credentials</h3>
      <p>
        Some credentials access multiple services:
      </p>
      <ul>
        <li>OAuth credentials used across platforms</li>
        <li>SSO credentials for enterprise services</li>
        <li>Admin accounts spanning services</li>
      </ul>
      <p>
        <strong>Solution:</strong> Create "Shared Services" or "Enterprise SSO" project
      </p>

      <h3>Service Dependencies</h3>
      <p>
        Document service relationships in LockPulse notes:
      </p>
      <ul>
        <li>Which credentials depend on others</li>
        <li>Service integration requirements</li>
        <li>Rotation impact on connected services</li>
      </ul>

      <h2>Tagging Strategies</h2>

      <h3>Multi-Dimensional Tagging</h3>
      <p>
        Use tags for multiple classification dimensions:
      </p>
      <ul>
        <li><strong>Service type:</strong> <code>database</code>, <code>api</code>, <code>cloud</code></li>
        <li><strong>Environment:</strong> <code>prod</code>, <code>staging</code>, <code>dev</code></li>
        <li><strong>Criticality:</strong> <code>critical</code>, <code>important</code>, <code>low-priority</code></li>
        <li><strong>Access level:</strong> <code>admin</code>, <code>read-write</code>, <code>read-only</code></li>
        <li><strong>Rotation status:</strong> <code>rotation-due</code>, <code>recently-rotated</code></li>
      </ul>

      <h3>Tag Naming Conventions</h3>
      <p>
        Maintain consistency:
      </p>
      <ul>
        <li>Use lowercase</li>
        <li>Use hyphens for multi-word tags</li>
        <li>Prefix system tags: <code>system-critical</code></li>
        <li>Keep tags concise but descriptive</li>
      </ul>

      <h2>Searching and Filtering</h2>

      <h3>Quick Retrieval Patterns</h3>
      <p>
        Find credentials fast with service organization:
      </p>
      <ul>
        <li><strong>By service:</strong> Search "AWS" to find all AWS credentials</li>
        <li><strong>By environment:</strong> Filter by "production" tag</li>
        <li><strong>By type:</strong> Filter "database" tag for all database passwords</li>
        <li><strong>Combined:</strong> Search "AWS + production" for prod AWS credentials</li>
      </ul>

      <h3>Saved Searches</h3>
      <p>
        Create and save common search queries:
      </p>
      <ul>
        <li>"All production credentials"</li>
        <li>"Credentials due for rotation"</li>
        <li>"Admin-level access credentials"</li>
        <li>"Recently modified credentials"</li>
      </ul>

      <h2>Service Catalog Approach</h2>

      <h3>Maintaining a Service Inventory</h3>
      <p>
        Document all services in use:
      </p>
      <ol>
        <li>Create master list of all services</li>
        <li>Map each service to LockPulse project</li>
        <li>Document credential types per service</li>
        <li>Note rotation requirements</li>
        <li>Identify credential owners</li>
      </ol>

      <h3>Service Documentation in LockPulse</h3>
      <p>
        For each service, document:
      </p>
      <ul>
        <li>Service URL and documentation links</li>
        <li>What the credential accesses</li>
        <li>Permissions and scopes</li>
        <li>Rotation schedule</li>
        <li>Emergency contact</li>
        <li>Dependencies on other services</li>
      </ul>

      <h2>Scaling Your Organization</h2>

      <h3>As Your Service Count Grows</h3>
      <p>
        Strategies for managing hundreds of services:
      </p>
      <ul>
        <li>Create sub-projects for related services</li>
        <li>Use more granular tagging</li>
        <li>Implement naming conventions strictly</li>
        <li>Assign service ownership to team members</li>
        <li>Regular cleanup of unused credentials</li>
      </ul>

      <h3>Periodic Organization Audits</h3>
      <p>
        Quarterly review:
      </p>
      <ol>
        <li>Identify credentials in wrong projects</li>
        <li>Find untagged or poorly tagged credentials</li>
        <li>Remove credentials for deprecated services</li>
        <li>Update documentation and notes</li>
        <li>Verify service inventory is current</li>
      </ol>

      <h2>Integration with Service Discovery</h2>

      <h3>Automated Service Tracking</h3>
      <p>
        Connect service organization with infrastructure:
      </p>
      <ul>
        <li>Tag credentials with service identifiers from infrastructure as code</li>
        <li>Sync with service mesh or API gateway configurations</li>
        <li>Alert when new services lack credential documentation</li>
      </ul>

      <h2>Best Practices Summary</h2>
      <ul>
        <li>✅ Group credentials by service category</li>
        <li>✅ Use consistent naming conventions</li>
        <li>✅ Apply multi-dimensional tags</li>
        <li>✅ Document service details in notes</li>
        <li>✅ Maintain service inventory</li>
        <li>✅ Assign service ownership</li>
        <li>✅ Regular organization audits</li>
        <li>✅ Make credentials easy to find</li>
      </ul>
    </>
  ),
}
