import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogLayout from '../components/BlogLayout'
import BlogContent from '../components/BlogContent'
import { getBlogBySlug, getAllBlogSlugs } from '../content'

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogBySlug(params.slug)
  
  if (!post) {
    return {
      title: 'Blog Not Found | LockPulse',
      description: 'The requested blog post could not be found.',
    }
  }

  const canonicalUrl = `https://lockpulse.com/blog/${post.slug}`
  const publishedTime = new Date(post.date).toISOString()

  return {
    title: `${post.title} | LockPulse Blog`,
    description: post.description,
    keywords: [
      ...post.tags,
      'LockPulse',
      'password manager',
      'zero-knowledge',
      'security',
      'credential management',
    ].join(', '),
    authors: [{ name: 'LockPulse Security Team' }],
    creator: 'LockPulse',
    publisher: 'LockPulse',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonicalUrl,
      siteName: 'LockPulse',
      locale: 'en_US',
      type: 'article',
      publishedTime,
      modifiedTime: publishedTime,
      authors: ['LockPulse Security Team'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@LockPulse',
      site: '@LockPulse',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getBlogBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: 'https://lockpulse.com/og-image.png',
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'LockPulse Security Team',
      url: 'https://lockpulse.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'LockPulse',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lockpulse.com/logo.png',
      },
      url: 'https://lockpulse.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://lockpulse.com/blog/${post.slug}`,
    },
    keywords: post.tags.join(', '),
    articleSection: post.tags[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  }

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://lockpulse.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://lockpulse.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://lockpulse.com/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BlogLayout
        title={post.title}
        description={post.description}
        readTime={post.readTime}
        date={post.date}
        tags={post.tags}
        relatedBlogs={post.relatedBlogs}
      >
        <BlogContent>
          <post.content />
        </BlogContent>
      </BlogLayout>
    </>
  )
}
