import fs from "fs";
import matter from "gray-matter";
import path from "path";

export type BlogPost = {
  meta: BlogPostMeta;
  content: string;
};

export type BlogPostMeta = {
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
  image?: string;
  imageAlt?: string;
  id?: string;
  readTime?: string;
  category?: string;
  featured?: boolean;
};

// Path to our content directory
const contentDirectory = path.join(process.cwd(), "posts");

// CALCULATE READ TIME FROM CONTENT
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200; // AVERAGE READING SPEED
  const wordCount = content.trim().split(/\s+/).length; // COUNT WORDS IN CONTENT
  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute); // ROUND UP TO NEAREST MINUTE
  return `${readTimeMinutes} min read`; // FORMAT AS STRING
}

// GET ALL POST SLUGS
export function getPostSlugs(): string[] {
  try {
    const files = fs.readdirSync(contentDirectory);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""));
  } catch (error) {
    console.error("Error reading blog directory:", error);
    return [];
  }
}

// GET POST BY SLUG
export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(contentDirectory, `${slug}.mdx`);

  try {
    // Read file content using sync fs (for RSC)
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse frontmatter and content
    const { data, content } = matter(fileContent);

    // Validate required fields
    if (!data.title || !data.date) {
      console.warn(`Missing required frontmatter in ${slug}.mdx`);
    }

    return {
      meta: {
        slug: slug,
        title: data.title || "Untitled",
        description: data.description || "",
        date: data.date || new Date().toISOString(),
        author: data.author || "Unknown",
        tags: data.tags || [],
        image: data.image,
        imageAlt: data.imageAlt,
        excerpt: data.excerpt,
        category: data.category,
        featured: data.featured,
        id: data.id,
        readTime: calculateReadTime(content),
      } as BlogPostMeta,
      content: content, // Return raw content for MDXRemote/rsc
    };
  } catch (error) {
    console.error(`Error processing ${slug}.mdx:`, error);
    return null;
  }
}

// GET ALL POSTS WITH METADATA
export function getAllPosts(): BlogPostMeta[] {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => {
    const post = getPostBySlug(slug);
    return post?.meta;
  });

  // Remove null values and sort by date (newest first)
  return posts
    .filter((post): post is BlogPostMeta => !!post)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// GET RELATED POSTS
export function getRelatedPosts(inputSlug: string): BlogPostMeta[] {
  const slugs = getPostSlugs();
  const relatedPosts = slugs.filter((slug) => slug !== inputSlug);

  return relatedPosts
    .map((slug) => getPostBySlug(slug)?.meta)
    .filter(
      (post): post is BlogPostMeta =>
        post?.tags?.some((tag) => post.tags?.includes(tag)) ?? false
    )
    .slice(0, 3);
}
