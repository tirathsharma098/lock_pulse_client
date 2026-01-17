'use client';
export default function BlogContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="blog-content space-y-6 text-gray-300">
      <style jsx global>{`
        .blog-content h2 {
          color: #fff;
          font-size: 2rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content h3 {
          color: #e2e8f0;
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .blog-content p {
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }
        .blog-content ul, .blog-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .blog-content strong {
          color: #60a5fa;
          font-weight: 600;
        }
        .blog-content code {
          background: #1e293b;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          color: #60a5fa;
        }
        .blog-content a {
          color: #60a5fa;
          text-decoration: underline;
        }
        .blog-content a:hover {
          color: #93c5fd;
        }
      `}</style>
      {children}
    </div>
  )
}
