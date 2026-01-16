import Link from 'next/link'
import { Shield, Clock, Tag, Calendar, ArrowLeft } from 'lucide-react'
import { Metadata } from 'next'

interface BlogLayoutProps {
  title: string
  description: string
  readTime: string
  date: string
  tags: string[]
  children: React.ReactNode
  relatedBlogs: Array<{ slug: string; title: string }>
}

export default function BlogLayout({
  title,
  description,
  readTime,
  date,
  tags,
  children,
  relatedBlogs
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-white">LockPulse</span>
          </Link>
          <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      {/* Blog Header */}
      <header className="container mx-auto px-6 py-12 max-w-4xl">
        <Link href="/blog" className="text-primary hover:underline mb-4 inline-block">
          ← All Blogs
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl text-gray-300 mb-6">{description}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span key={tag} className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      </header>

      {/* Blog Content */}
      <main className="container mx-auto px-6 pb-12 max-w-4xl">
        <article className="prose prose-invert prose-lg max-w-none">
          {children}
        </article>

        {/* CTA Section */}
        <div className="mt-16 bg-slate-800 rounded-xl p-8 border border-primary/30">
          <h3 className="text-2xl font-bold text-white mb-4">
            Secure Your Team's Credentials with LockPulse
          </h3>
          <p className="text-gray-300 mb-6">
            Organize credentials by project, share securely with your team, and maintain complete control with zero-knowledge encryption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all text-center">
              Start Free Today
            </Link>
            <Link href="/login" className="border border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all text-center">
              Sign In
            </Link>
          </div>
        </div>

        {/* Related Blogs */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedBlogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-primary transition-all"
              >
                <h4 className="text-white font-semibold mb-2">{blog.title}</h4>
                <span className="text-primary text-sm">Read more →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 mt-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div>
              <p>Author: LockPulse Security Team</p>
              <p>Last updated: {date}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p>&copy; 2025 LockPulse. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
