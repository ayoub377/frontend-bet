// app/blog/[slug]/page.tsx
import { getPostBySlug, getAllPostsMeta } from '@/lib/posts'
import {MDXContent} from "@/components/providers/MDXContent";

export async function generateStaticParams() {
  const posts = await getAllPostsMeta()
  return posts.map((p) => ({ slug: p.slug }))
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { meta, content } = await getPostBySlug(params.slug)

  return (
    <article className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <header className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {meta.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-gray-500">
          <span>By {meta.author}</span>
          <span>•</span>
          <time dateTime={meta.date}>
            {new Date(meta.date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        {meta.excerpt && (
          <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto">
            {meta.excerpt}
          </p>
        )}
      </header>

      {/* Content */}
      <div className="prose lg:prose-xl max-w-3xl mx-auto text-gray-800">
        <MDXContent {...content} />
      </div>
    </article>
  )
}
