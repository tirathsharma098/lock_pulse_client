import { blog as blog1 } from './what-is-zero-knowledge-password-manager'
import { blog as blog2 } from './client-side-encryption-explained'
import { blog as blog3 } from './why-master-password-matters'
import { blog as blog4 } from './project-based-credential-management'
import { blog as blog5 } from './managing-aws-credentials-securely'
import { blog as blog6 } from './aes-256-encryption-standard'
import { blog as blog7 } from './secure-credential-sharing-teams'
import { blog as blog8 } from './github-token-security'
import { blog as blog9 } from './database-password-management'
import { blog as blog10 } from './api-key-management'
import { blog as blog11 } from './team-credential-management'
import { blog as blog12 } from './password-manager-comparison'
import { blog as blog13 } from './managing-multiple-environments'
import { blog as blog14 } from './creating-strong-master-password'
import { blog as blog15 } from './server-side-vs-client-side-security'
import { blog as blog16 } from './importing-passwords-guide'
import { blog as blog17 } from './access-control-best-practices'
import { blog as blog18 } from './credential-rotation-automation'
import { blog as blog19 } from './developer-credential-workflow'
import { blog as blog20 } from './service-level-credential-organization'
import { blog as blog21 } from './encryption-key-derivation'
import { blog as blog22 } from './password-recovery-options'
import { blog as blog23 } from './getting-started-lockpulse'
import { blog as blog24 } from './why-choose-lockpulse'
import { blog as blog25 } from './ci-cd-credential-security'
import { blog as blog26 } from './audit-logging-compliance'
import { blog as blog27 } from './security-best-practices'
import { blog as blog28 } from './first-project-setup'
import { blog as blog29 } from './organizing-imported-passwords'
import { blog as blog30 } from './credential-tagging-strategies'

export const blogs = [
  blog1, blog2, blog3, blog4, blog5, blog6, blog7, blog8, blog9, blog10,
  blog11, blog12, blog13, blog14, blog15, blog16, blog17, blog18, blog19, blog20,
  blog21, blog22, blog23, blog24, blog25, blog26, blog27, blog28, blog29, blog30
]

export const getBlogBySlug = (slug: string) =>
  blogs.find(b => b.slug === slug)

export const getAllBlogSlugs = () =>
  blogs.map(b => b.slug)

export const getRelatedBlogs = (currentSlug: string, limit: number = 3) => {
  const currentBlog = getBlogBySlug(currentSlug)
  if (!currentBlog) return []
  
  return currentBlog.relatedBlogs.slice(0, limit)
}
