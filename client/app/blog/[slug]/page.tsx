import BlogStylings from "@/components/blog/BlogStylings";
import { getPostBySlug, getPostSlugs } from "@/utils/mdx";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = getPostSlugs();
  return posts.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.meta.title} | Reddinbox Blog`,
    description: post.meta.description,
    keywords: post.meta.tags,
    authors: [{ name: "Nicolas" }],
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      authors: ["Nicolas"],
      images: post.meta.image ? [post.meta.image] : [],
      siteName: "Reddinbox",
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: post.meta.image ? [post.meta.image] : [],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          {post.meta.title}
        </h1>
        <p className="font-body text-xl text-muted-foreground mb-6">
          {post.meta.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>By Nicolas</span>
          <time dateTime={post.meta.date}>
            {new Date(post.meta.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.meta.readTime && <span>{post.meta.readTime}</span>}
        </div>
      </header>

      <div className="prose prose-lg max-w-none font-body">
        <MDXContent source={post.content} />
      </div>
    </article>
  );
}

const MDXContent = ({ source }: { source: string }) => {
  const components = BlogStylings();
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [],
    },
  };

  return (
    <MDXRemote source={source} components={components} options={options} />
  );
};
