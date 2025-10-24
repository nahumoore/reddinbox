import BlogStylings from "@/components/blog/BlogStylings";
import { getPostBySlug } from "@/utils/mdx";
import { IconArrowLeft } from "@tabler/icons-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const { getPostSlugs } = await import("@/utils/mdx");
  const slugs = getPostSlugs("playbooks");

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "playbooks");

  if (!post) {
    return {
      title: "Playbook Not Found",
      description: "The requested playbook could not be found.",
    };
  }

  const title = post.meta.title;
  const description = post.meta.description;
  const url = `https://reddinbox.com/playbooks/${slug}`;
  const image = post.meta.image!;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Reddinbox",
      type: "article",
      publishedTime: post.meta.date,
      authors: ["Nicolas More"],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@reddinbox",
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function PlaybookPost({ params }: Props) {
  const p = await params;
  const slug = (await p.slug) as string;
  const post = await getPostBySlug(slug, "playbooks");

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6">
      {/* Back Navigation */}
      <div className="pt-8 pb-4 max-w-[720px] mx-auto">
        <Link
          href="/playbooks"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft className="size-4" />
          Back to Playbooks
        </Link>
      </div>

      <article className="pb-12 md:pb-16 max-w-[720px] mx-auto">
        {/* Header Section */}
        <header className="mx-auto mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-5 leading-tight">
            {post.meta.title}
          </h1>
          <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
            {post.meta.description}
          </p>
          {post.meta.image && (
            <div className="relative w-full aspect-video mt-8 rounded-2xl overflow-hidden shadow-2xl border border-border/40">
              <Image
                src={post.meta.image}
                alt={post.meta.imageAlt || post.meta.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Author Section */}
        <div className="mx-auto mb-12 pb-12 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/founder.webp"
                alt="Nicolas More"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-body font-medium text-foreground">
                Nicolas More
              </div>
              <div className="font-body text-sm text-muted-foreground">
                Helping you to grow on Reddit without being spammy
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.meta.date}>
                {new Date(post.meta.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {post.meta.readTime && (
                <>
                  <span className="text-muted-foreground/40">•</span>
                  <span>{post.meta.readTime}</span>
                </>
              )}
            </div>
          </div>
          {/* Mobile date/time */}
          <div className="sm:hidden flex items-center gap-3 text-sm text-muted-foreground mt-3 ml-16">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
            {post.meta.readTime && (
              <>
                <span className="text-muted-foreground/40">•</span>
                <span>{post.meta.readTime}</span>
              </>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="mx-auto font-body max-w-[720px]">
          <MDXContent source={post.content} />
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-8 md:py-12">
        <div className="mx-auto text-center bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12 border border-primary/20 max-w-[720px]">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Ready to Put This Into Action?
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Stop missing opportunities in your Reddit inbox. Reddinbox helps you
            track mentions, engage authentically, and grow your presence without
            the spam—just like this playbook teaches.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Start Your Free Trial
            </Link>
            <p className="text-sm text-muted-foreground">
              No credit card required • 7-day free trial
            </p>
          </div>
        </div>
      </section>
    </main>
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
