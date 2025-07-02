// app/blog/page.tsx
import Link from 'next/link'
import { getAllPostsMeta, PostMeta } from '@/lib/posts'

export const revalidate = 60

export default async function BlogIndex() {
  const posts: PostMeta[] = await getAllPostsMeta()
  return (
    <main className="mx-auto max-w-4xl py-16 px-4">
      <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-12">
        Latest Insights
      </h1>
      <ul className="space-y-8">
        {posts.map(({ slug, title, date, excerpt }) => (
          <li key={slug}>
            <article>
              <Link legacyBehavior href={`/blog/${slug}`}>
                <a
                  aria-label={`Read "${title}"`}
                  className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {title}
                  </h2>
                  <p className="text-gray-600 line-clamp-2">{excerpt}</p>
                  <time className="mt-4 block text-sm text-gray-500">
                    {new Date(date).toLocaleDateString()}
                  </time>
                </a>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </main>
  )
}
