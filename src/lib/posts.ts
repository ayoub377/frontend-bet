// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import type { ReactNode } from 'react'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface PostMeta {
  slug: string
  title: string
  date: string  // YYYY-MM-DD
  author: string
  excerpt: string
}

export async function getPostSlugs(): Promise<string[]> {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}

export async function getPostBySlug(slug: string): Promise<{ meta: PostMeta; content: ReactNode }> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content: mdxSource } = matter(raw)

  // compileMDX returns { content: ReactNode, frontmatter: Record }
  const { content, frontmatter } = await compileMDX<Partial<PostMeta>>({
    source: mdxSource,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        ],
      },
    },
  })

  return {
    meta: {
      slug,
      title: frontmatter.title!,
      date: frontmatter.date!,
      author: frontmatter.author ?? 'Sharper Bets Team',
      excerpt: frontmatter.excerpt ?? 'No excerpt available.',
    },
    content,
  }
}

export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs()
  const posts = slugs.map((slug) => {
    const raw = fs.readFileSync(path.join(postsDirectory, `${slug}.mdx`), 'utf8')
    const { data } = matter(raw)
    const fm = data as Partial<PostMeta>
    return {
      slug,
      title: fm.title!,
      date: fm.date!,
      author: fm.author ?? 'Sharper Bets Team',
      excerpt: fm.excerpt ?? 'No excerpt available.',
    }
  })
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
