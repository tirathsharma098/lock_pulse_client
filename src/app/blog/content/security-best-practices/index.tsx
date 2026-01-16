import { BlogPost } from '../../types'

export const blog: BlogPost = {
  slug: 'security-best-practices',
  title: 'Security Best Practices: Beyond Password Management',
  description: 'Comprehensive guide to security hygiene for individuals and teams.',
  readTime: '8 min read',
  date: '2024-12-21',
  tags: ['Security', 'Best Practices', 'Guide'],
  relatedBlogs: [
    { slug: 'creating-strong-master-password', title: 'Creating Strong Master Password' },
    { slug: 'access-control-best-practices', title: 'Access Control Best Practices' },
    { slug: 'credential-rotation-automation', title: 'Credential Rotation' },
  ],
  content: () => (
    <>
      <h2>Security Is a Mindset, Not Just a Tool</h2>
      <p>
        Using <strong>LockPulse</strong> is a great first step, but true security requires adopting comprehensive
        best practices. This guide covers essential security hygiene beyond password management—protecting you
        from the most common threats.
      </p>

      <h3>The Security Trinity</h3>
      <ul>
        <li><strong>Prevention:</strong> Stop threats before they happen</li>
        <li><strong>Detection:</strong> Identify security incidents quickly</li>
        <li><strong>Response:</strong> Act decisively when breaches occur</li>
      </ul>

      <h2>Password Security Fundamentals</h2>

      <h3>Master Password Excellence</h3>
      <p>
        Your <a href="/blog/creating-strong-master-password">master password</a> is the foundation:
      </p>
      <ul>
        <li><strong>Length over complexity:</strong> 20+ characters beats 8 complex characters</li>
        <li><strong>Uniqueness is critical:</strong> Never reuse your master password</li>
        <li><strong>Memorable but unpredictable:</strong> Use passphrase method</li>
        <li><strong>Regular practice:</strong> Type it daily until muscle memory forms</li>
      </ul>

      <h3>Password Diversity</h3>
      <p>
        For all other accounts:
      </p>
      <ul>
        <li>Generate unique passwords for every service</li>
        <li>Use LockPulse's password generator (16+ characters)</li>
        <li>Never reuse passwords across accounts</li>
        <li>Update compromised passwords immediately</li>
      </ul>

      <h3>Password Rotation Strategy</h3>
      <p>
        Not all passwords need frequent rotation:
      </p>
      <ul>
        <li><strong>High-value accounts:</strong> Rotate every 90 days (banking, email)</li>
        <li><strong>Work credentials:</strong> Follow company policy (typically 90 days)</li>
        <li><strong>Low-risk accounts:</strong> Rotate when compromised or annually</li>
        <li><strong>Master password:</strong> Only if suspected compromise</li>
      </ul>
      <p>
        Learn more about <a href="/blog/credential-rotation-automation">credential rotation automation</a>.
      </p>

      <h2>Multi-Factor Authentication (2FA/MFA)</h2>

      <h3>Enable 2FA Everywhere</h3>
      <p>
        Priority accounts for 2FA:
      </p>
      <ol>
        <li><strong>Email accounts:</strong> Your password reset gateway</li>
        <li><strong>LockPulse:</strong> Protect your password vault</li>
        <li><strong>Financial accounts:</strong> Banks, investment platforms</li>
        <li><strong>Work accounts:</strong> Company email, VPN, critical systems</li>
        <li><strong>Social media:</strong> Prevent account hijacking</li>
      </ol>

      <h3>2FA Method Hierarchy</h3>
      <p>
        From most to least secure:
      </p>
      <ul>
        <li><strong>1. Hardware keys:</strong> YubiKey, Titan Security Key (most secure)</li>
        <li><strong>2. Authenticator apps:</strong> Google Authenticator, Authy (recommended)</li>
        <li><strong>3. SMS codes:</strong> Better than nothing, vulnerable to SIM swapping</li>
        <li><strong>❌ Email codes:</strong> Avoid if possible (circular dependency)</li>
      </ul>

      <h3>Backup Codes</h3>
      <p>
        When enabling 2FA:
      </p>
      <ul>
        <li>Save backup codes in LockPulse secure notes</li>
        <li>Print one copy and store in safe place</li>
        <li>Never store in same location as primary 2FA device</li>
        <li>Test recovery process periodically</li>
      </ul>

      <h2>Device Security</h2>

      <h3>Computer Security</h3>
      <p>
        Essential protections:
      </p>
      <ul>
        <li><strong>Full disk encryption:</strong> BitLocker (Windows), FileVault (Mac), LUKS (Linux)</li>
        <li><strong>Automatic updates:</strong> Enable for OS and all software</li>
        <li><strong>Antivirus/EDR:</strong> Use reputable security software</li>
        <li><strong>Firewall:</strong> Enable and configure properly</li>
        <li><strong>Screen lock:</strong> Auto-lock after 5 minutes of inactivity</li>
      </ul>

      <h3>Mobile Device Security</h3>
      <ul>
        <li><strong>Strong passcode:</strong> 6+ digits or alphanumeric</li>
        <li><strong>Biometric lock:</strong> Fingerprint or Face ID as secondary</li>
        <li><strong>Find My Device:</strong> Enable remote wipe capability</li>
        <li><strong>App permissions:</strong> Review and minimize regularly</li>
        <li><strong>No jailbreaking:</strong> Compromises built-in security</li>
      </ul>

      <h3>Browser Security</h3>
      <ul>
        <li>Keep browser updated to latest version</li>
        <li>Use privacy-focused browser (Firefox, Brave) or harden Chrome</li>
        <li>Install only essential extensions (each is a risk)</li>
        <li>Clear cookies and cache regularly</li>
        <li>Use private/incognito mode for sensitive activities</li>
      </ul>

      <h2>Network Security</h2>

      <h3>Home Network</h3>
      <p>
        Secure your home base:
      </p>
      <ul>
        <li><strong>Change default router password:</strong> Immediately after setup</li>
        <li><strong>Use WPA3 encryption:</strong> Or WPA2 if WPA3 unavailable</li>
        <li><strong>Disable WPS:</strong> Convenient but vulnerable</li>
        <li><strong>Update router firmware:</strong> Check quarterly</li>
        <li><strong>Separate guest network:</strong> Isolate visitor devices</li>
      </ul>

      <h3>Public WiFi Safety</h3>
      <p>
        When using public networks:
      </p>
      <ul>
        <li><strong>Always use VPN:</strong> Encrypt all traffic</li>
        <li><strong>Verify network name:</strong> Confirm with staff to avoid evil twins</li>
        <li><strong>Disable auto-connect:</strong> Prevent automatic joins</li>
        <li><strong>Use cellular when possible:</strong> Mobile data is more secure</li>
        <li><strong>Avoid sensitive transactions:</strong> No banking on public WiFi</li>
      </ul>

      <h3>VPN Usage</h3>
      <p>
        Choose and configure VPN properly:
      </p>
      <ul>
        <li>Use reputable VPN provider (NordVPN, ProtonVPN, Mullvad)</li>
        <li>Avoid free VPNs (you're the product)</li>
        <li>Enable kill switch (stops traffic if VPN drops)</li>
        <li>Choose nearest server for performance</li>
        <li>Always on when on untrusted networks</li>
      </ul>

      <h2>Email Security</h2>

      <h3>Email Account Protection</h3>
      <ul>
        <li><strong>Unique password:</strong> Never reused from other services</li>
        <li><strong>Strong 2FA:</strong> Authenticator app, not SMS</li>
        <li><strong>Recovery email:</strong> Separate, equally secure account</li>
        <li><strong>Activity monitoring:</strong> Review login history monthly</li>
      </ul>

      <h3>Phishing Defense</h3>
      <p>
        Recognize and avoid phishing:
      </p>
      <ul>
        <li><strong>Verify sender:</strong> Check email address, not just display name</li>
        <li><strong>Suspicious links:</strong> Hover before clicking, check URL</li>
        <li><strong>Urgent requests:</strong> Pressure tactics are red flags</li>
        <li><strong>Unexpected attachments:</strong> Scan with antivirus before opening</li>
        <li><strong>Grammar errors:</strong> Professional companies use proper English</li>
      </ul>

      <h3>Email Best Practices</h3>
      <ul>
        <li>Never send passwords via email</li>
        <li>Use end-to-end encryption for sensitive data (ProtonMail, Tutanota)</li>
        <li>Unsubscribe from unnecessary emails (reduces attack surface)</li>
        <li>Use email aliases for different purposes</li>
        <li>Regular inbox cleanup (old emails = old attack vectors)</li>
      </ul>

      <h2>Social Engineering Defense</h2>

      <h3>Common Social Engineering Tactics</h3>
      <ul>
        <li><strong>Pretexting:</strong> Fabricated scenarios to gain trust</li>
        <li><strong>Baiting:</strong> Offers that seem too good to be true</li>
        <li><strong>Quid pro quo:</strong> "Help" in exchange for information</li>
        <li><strong>Tailgating:</strong> Following authorized person into secure area</li>
      </ul>

      <h3>Defense Strategies</h3>
      <ul>
        <li><strong>Verify identity:</strong> Call back using official number, not provided number</li>
        <li><strong>Question urgency:</strong> Legitimate requests allow time for verification</li>
        <li><strong>Limit information sharing:</strong> Share minimum necessary</li>
        <li><strong>Follow protocols:</strong> Don't bypass security procedures, even for "VIPs"</li>
      </ul>

      <h2>Data Protection</h2>

      <h3>Backup Strategy</h3>
      <p>
        Follow 3-2-1 backup rule:
      </p>
      <ul>
        <li><strong>3 copies:</strong> Original plus two backups</li>
        <li><strong>2 different media:</strong> Hard drive + cloud, or hard drive + NAS</li>
        <li><strong>1 offsite:</strong> Cloud or physically separate location</li>
      </ul>

      <h3>Encryption at Rest</h3>
      <ul>
        <li>Encrypt all backups before uploading to cloud</li>
        <li>Use encrypted external drives for local backups</li>
        <li>Enable full disk encryption on all devices</li>
        <li>Store encryption keys separately from encrypted data</li>
      </ul>

      <h3>Secure File Deletion</h3>
      <p>
        When disposing of devices or sensitive files:
      </p>
      <ul>
        <li>Use secure deletion tools (not just recycle bin)</li>
        <li>Multiple overwrite passes for sensitive data</li>
        <li>Physical destruction of hard drives when decommissioning</li>
        <li>Factory reset isn't enough—use encryption + reset</li>
      </ul>

      <h2>Application Security</h2>

      <h3>Software Updates</h3>
      <ul>
        <li>Enable automatic updates for all software</li>
        <li>Update within 24 hours of security patches</li>
        <li>Remove unused software (reduces attack surface)</li>
        <li>Only install from official sources (App Store, official websites)</li>
      </ul>

      <h3>Permission Management</h3>
      <p>
        Regular permission audits:
      </p>
      <ul>
        <li>Review app permissions quarterly</li>
        <li>Revoke unnecessary permissions</li>
        <li>Understand why app needs each permission</li>
        <li>Deny if not essential for app function</li>
      </ul>

      <h2>Team Security (For Organizations)</h2>

      <h3>Security Training</h3>
      <p>
        Establish security culture:
      </p>
      <ul>
        <li>Onboarding security training for all employees</li>
        <li>Quarterly security awareness updates</li>
        <li>Phishing simulation exercises</li>
        <li>Clear reporting procedures for incidents</li>
      </ul>

      <h3>Access Control</h3>
      <p>
        Implement least privilege:
      </p>
      <ul>
        <li>Grant minimum necessary access</li>
        <li>Regular <a href="/blog/access-control-best-practices">access reviews</a></li>
        <li>Immediate revocation on offboarding</li>
        <li>Separate admin accounts from daily use accounts</li>
      </ul>

      <h3>Incident Response Plan</h3>
      <p>
        Prepare before incidents occur:
      </p>
      <ol>
        <li><strong>Detection:</strong> How will you know if breach occurs?</li>
        <li><strong>Containment:</strong> Steps to isolate compromised systems</li>
        <li><strong>Eradication:</strong> Remove threat from environment</li>
        <li><strong>Recovery:</strong> Restore systems and data</li>
        <li><strong>Lessons learned:</strong> Post-incident review and improvements</li>
      </ol>

      <h2>Privacy Best Practices</h2>

      <h3>Data Minimization</h3>
      <ul>
        <li>Share only necessary information with services</li>
        <li>Use fake/alternate data when possible (e.g., fake birthday)</li>
        <li>Decline optional data collection</li>
        <li>Delete old accounts you no longer use</li>
      </ul>

      <h3>Online Tracking Prevention</h3>
      <ul>
        <li><strong>Browser extensions:</strong> uBlock Origin, Privacy Badger</li>
        <li><strong>Cookie management:</strong> Auto-delete cookies on exit</li>
        <li><strong>Search engines:</strong> Use DuckDuckGo instead of Google</li>
        <li><strong>Email aliases:</strong> Unique email for each service</li>
      </ul>

      <h2>Security Checklist</h2>

      <h3>Daily</h3>
      <ul>
        <li>✅ Lock device when stepping away</li>
        <li>✅ Review unusual login attempts</li>
        <li>✅ Verify sender before clicking email links</li>
      </ul>

      <h3>Weekly</h3>
      <ul>
        <li>✅ Check for software updates</li>
        <li>✅ Review account activity on critical services</li>
        <li>✅ Backup important files</li>
      </ul>

      <h3>Monthly</h3>
      <ul>
        <li>✅ Review LockPulse <a href="/blog/audit-logging-compliance">audit logs</a></li>
        <li>✅ Update passwords for high-value accounts</li>
        <li>✅ Review app permissions</li>
        <li>✅ Check credit report for identity theft</li>
      </ul>

      <h3>Quarterly</h3>
      <ul>
        <li>✅ Full security audit of all accounts</li>
        <li>✅ Update router firmware</li>
        <li>✅ Review and update backup strategy</li>
        <li>✅ Security training refresher</li>
      </ul>

      <h3>Annually</h3>
      <ul>
        <li>✅ Change all critical passwords</li>
        <li>✅ Review and update incident response plan</li>
        <li>✅ Delete unused accounts and data</li>
        <li>✅ Full security posture assessment</li>
      </ul>

      <h2>Common Security Mistakes</h2>

      <h3>What to Avoid</h3>
      <ul>
        <li>❌ Reusing passwords across accounts</li>
        <li>❌ Clicking links in unsolicited emails</li>
        <li>❌ Using public WiFi without VPN</li>
        <li>❌ Ignoring software updates</li>
        <li>❌ Sharing passwords via email/chat</li>
        <li>❌ Using weak master passwords</li>
        <li>❌ Disabling 2FA for convenience</li>
        <li>❌ Trusting "too good to be true" offers</li>
        <li>❌ Posting sensitive information on social media</li>
        <li>❌ Using default passwords on devices</li>
      </ul>

      <h2>When Security Fails</h2>

      <h3>Breach Response</h3>
      <p>
        If you suspect account compromise:
      </p>
      <ol>
        <li><strong>Immediate:</strong> Change password on compromised account</li>
        <li><strong>5 minutes:</strong> Enable 2FA if not already active</li>
        <li><strong>15 minutes:</strong> Review account activity, revoke unknown sessions</li>
        <li><strong>30 minutes:</strong> Change passwords on accounts with same password</li>
        <li><strong>1 hour:</strong> Scan devices for malware</li>
        <li><strong>24 hours:</strong> Monitor for unauthorized activity</li>
        <li><strong>1 week:</strong> Review credit reports if financial data involved</li>
      </ol>

      <h3>LockPulse Breach Response</h3>
      <p>
        If you suspect LockPulse account compromise:
      </p>
      <ol>
        <li>Change master password immediately</li>
        <li>Review audit logs for unauthorized access</li>
        <li>Revoke all active sessions</li>
        <li>Rotate all stored credentials</li>
        <li>Enable 2FA if not already active</li>
        <li>Contact LockPulse support</li>
      </ol>

      <h2>Resources and Tools</h2>

      <h3>Recommended Security Tools</h3>
      <ul>
        <li><strong>Password Manager:</strong> LockPulse (obviously!)</li>
        <li><strong>2FA:</strong> Authy, Google Authenticator</li>
        <li><strong>VPN:</strong> ProtonVPN, Mullvad, NordVPN</li>
        <li><strong>Email:</strong> ProtonMail, Tutanota (encrypted)</li>
        <li><strong>Browser:</strong> Firefox, Brave</li>
        <li><strong>Antivirus:</strong> Windows Defender, Malwarebytes</li>
      </ul>

      <h3>Further Learning</h3>
      <ul>
        <li><a href="/blog/what-is-zero-knowledge-password-manager">Zero-Knowledge Security</a></li>
        <li><a href="/blog/team-credential-management">Team Security</a></li>
        <li><a href="/blog/ci-cd-credential-security">DevOps Security</a></li>
        <li><a href="/blog/emergency-access-planning">Emergency Planning</a></li>
      </ul>

      <h2>The Security Mindset</h2>
      <p>
        Security is not a destination but a journey. These practices form a foundation, but threats evolve.
        Stay informed, remain vigilant, and adapt. Using <strong>LockPulse</strong> with these best practices
        creates defense in depth—multiple layers of security protecting your digital life.
      </p>
      <p>
        Remember: The best security measure is the one you'll actually use consistently. Start with the basics,
        build habits, then layer on additional protections over time.
      </p>
    </>
  ),
}
