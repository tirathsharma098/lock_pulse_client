export interface BlogPost {
  slug: string
  title: string
  description: string
  readTime: string
  date: string
  tags: string[]
  relatedBlogs: Array<{ slug: string; title: string }>
  content: React.FC
}
