// lib/posts.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'; // Import for GitHub Flavored Markdown
import rehypeSlug from 'rehype-slug'; // Import for adding IDs to headings
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // Import for auto-linking headings

const postsDirectory = path.join(process.cwd(), 'posts')

/**
 * Defines the structure of a blog post's front matter (metadata).
 * Ensure your MDX files have these fields in their front matter.
 */
export interface PostMeta {
  slug: string
  title: string
  date: string // Assuming format 'YYYY-MM-DD'
  author: string // Added for blog cards
  excerpt: string // Added for blog cards
}

export async function getPostSlugs(): Promise<string[]> {
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

/**
 * Retrieves a single post by its slug, parsing its front matter and MDX content.
 * Includes optional MDX plugins for better rendering.
 */
export async function getPostBySlug(slug: string): Promise<{
  meta: PostMeta
  content: MDXRemoteSerializeResult
}> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // Explicitly cast data to PostMeta to ensure type safety
  const frontMatter = data as PostMeta;

  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm], // Enable GitHub Flavored Markdown (tables, task lists, etc.)
      rehypePlugins: [
        rehypeSlug, // Add IDs to headings (e.g., for linking)
        [rehypeAutolinkHeadings, { behavior: 'wrap' }], // Make headings clickable links to their ID
      ],
    },
  })

  return {
    meta: {
      slug,
      title: frontMatter.title,
      date: frontMatter.date,
      author: frontMatter.author || 'Sharper Bets Team', // Provide a default if author is missing
      excerpt: frontMatter.excerpt || 'No excerpt available.', // Provide a default if excerpt is missing
    },
    content: mdxSource
  }
}

/**
 * Retrieves metadata for all posts, sorted by date in descending order.
 * This is used for the blog index page.
 */
export async function getAllPostsMeta(): Promise<PostMeta[]> {
  const slugs = await getPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      // For the index page, we only need meta, so we optimize by not serializing content here
      const fullPath = path.join(postsDirectory, `${slug}.mdx`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const frontMatter = data as PostMeta;
      return {
        slug,
        title: frontMatter.title,
        date: frontMatter.date,
        author: frontMatter.author || 'Sharper Bets Team',
        excerpt: frontMatter.excerpt || 'No excerpt available.',
      };
    })
  )
  // Sort by date desc (most recent first)
  return posts.sort((a, b) => (new Date(a.date).getTime() < new Date(b.date).getTime() ? 1 : -1))
}
