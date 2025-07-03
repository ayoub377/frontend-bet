// app/blog/[slug]/page.tsx
import type { ReactNode } from 'react'
import { getPostBySlug, getAllPostsMeta } from '@/lib/posts'
import type { PostMeta } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = await getAllPostsMeta()
  return posts.map(({ slug }) => ({ slug }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { meta, content }: { meta: PostMeta; content: ReactNode } = await getPostBySlug(slug)

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          {meta.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <time dateTime={meta.date} className="uppercase">
            {new Date(meta.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
          <span>•</span>
          <span>By {meta.author}</span>
        </div>
        <hr className="mt-6 border-gray-200" />
      </header>

      {/* MDX Content */}
      <section className="prose prose-lg mx-auto">
        {content}
      </section>

      {/* Footer CTA / Navigation */}
      <footer className="mt-16 border-t pt-8 border-gray-200 text-center">
        <p className="text-gray-600">
          Enjoyed this post?{' '}
          <a href="/blog" className="text-indigo-600 hover:underline">
            Back to all articles
          </a>
        </p>
      </footer>
    </article>
  )
}
