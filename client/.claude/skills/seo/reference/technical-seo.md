# Technical SEO Reference

## Table of Contents
- [Core Web Vitals](#core-web-vitals)
- [Page Speed Optimization](#page-speed-optimization)
- [Mobile Optimization](#mobile-optimization)
- [Site Crawlability](#site-crawlability)
- [Schema Markup](#schema-markup)
- [Structured Data](#structured-data)

## Core Web Vitals

### Overview
Core Web Vitals are Google's three key metrics measuring page experience. They're ranking factors and appear in Google Search Console.

### The Three Metrics

#### 1. Largest Contentful Paint (LCP)
**What it measures:** How long the largest visual element takes to load and render

**Target:** < 2.5 seconds (good) | 2.5-4s (needs improvement) | > 4s (poor)

**Common causes of poor LCP:**
- Slow server response time
- Large render-blocking JavaScript
- Non-optimized images
- CSS blocking rendering
- Render-blocking third-party scripts (analytics, ads, chat widgets)

**Optimization strategies:**
- Minimize server response time (database queries, hosting)
- Defer non-critical JavaScript
- Optimize and lazy-load images
- Use critical CSS inline
- Defer third-party scripts or load asynchronously

#### 2. First Input Delay (FID) / Interaction to Next Paint (INP)
**What it measures:** Time between user interaction and browser response

**Target:** < 100ms (good) | 100-300ms (needs improvement) | > 300ms (poor)

**Note:** FID being phased out in favor of INP in 2024, but both remain important

**Common causes:**
- Large JavaScript bundles
- Main thread blocking (heavy computation)
- Third-party script execution
- Inefficient event handlers

**Optimization strategies:**
- Break long JavaScript tasks into smaller chunks
- Use Web Workers for heavy computation
- Optimize event handlers
- Defer non-critical JavaScript
- Use requestIdleCallback for non-urgent work

#### 3. Cumulative Layout Shift (CLS)
**What it measures:** Unexpected visual shifts during page load (buttons moving, content jumping)

**Target:** < 0.1 (good) | 0.1-0.25 (needs improvement) | > 0.25 (poor)

**Common causes:**
- Images or ads without dimensions
- Dynamically injected content
- Web fonts causing layout shift
- Unoptimized embeds (YouTube, social, maps)

**Optimization strategies:**
- Specify image/video dimensions (use aspect-ratio CSS)
- Preload fonts with `font-display: swap`
- Reserve space for ads and embeds
- Avoid inserting content above existing content during load
- Use transform animations instead of position changes

## Page Speed Optimization

### Frontend Optimization

#### Asset Optimization
- **Image optimization** - Compress, use WebP format, implement responsive images
- **JavaScript bundling** - Code splitting, tree-shaking, minification
- **CSS minification** - Remove unused styles, critical CSS inlining
- **Font optimization** - Limit font variants, use system fonts as fallback, preload

#### Lazy Loading
```
<!-- Images -->
<img src="image.jpg" loading="lazy" alt="description" />

<!-- Iframes -->
<iframe src="video.html" loading="lazy"></iframe>
```

#### Resource Hints
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- DNS prefetch for secondary resources -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Preload critical resources -->
<link rel="preload" href="critical.js" as="script">
```

### Server-Side Optimization

#### Response Time
- **Target** - Server response time (TTFB) under 600ms
- **Optimization** - Database query optimization, caching, CDN usage
- **Monitoring** - Track TTFB in Search Console and monitoring tools

#### Static Content Delivery
- **CDN usage** - Serve assets from geographically distributed servers
- **Caching headers** - Set appropriate cache-control and expires headers
- **Compression** - Enable gzip or brotli compression on text resources
- **Static generation** - Pre-generate static content when possible (SSG)

#### Dynamic Content Caching
- **Browser caching** - Cache-Control headers with appropriate TTL
- **Server-side caching** - Cache database queries, API responses
- **Edge caching** - Use CDN edge caching for dynamic content

## Mobile Optimization

### Mobile-First Indexing
Google primarily uses the mobile version of content for indexing and ranking. Mobile optimization is critical.

### Mobile Best Practices
- **Viewport meta tag** - Always include: `<meta name="viewport" content="width=device-width, initial-scale=1">`
- **Responsive design** - Use mobile-first CSS approach
- **Touch targets** - Buttons/links minimum 48x48 pixels
- **Readable text** - Minimum 16px font size, sufficient contrast (WCAG AA)
- **No pop-ups** - Avoid intrusive interstitials on mobile
- **Mobile menu** - Functional navigation on small screens
- **Form optimization** - Appropriate input types (email, tel, number)

### Mobile Performance
- **Prioritize above-fold content** - Load critical content first
- **Minimize third-party scripts** - Mobile bandwidth is constrained
- **Test on real devices** - Emulation isn't sufficient
- **Mobile-specific metrics** - Test with slower 3G/4G, slower processors

## Site Crawlability

### Robots.txt
Controls which pages search engines can access.

```
# Allow all bots except bad actors
User-agent: *
Allow: /

# Block specific paths
Disallow: /admin/
Disallow: /private/
Disallow: /temp/

# Specify crawl delay (optional)
Crawl-delay: 1
```

### XML Sitemap
Helps search engines discover all pages efficiently.

**Sitemap best practices:**
- Include all important pages
- Update regularly or use dynamic generation
- Limit to 50,000 URLs per sitemap (split if needed)
- Use robots.txt to point to sitemap: `Sitemap: https://example.com/sitemap.xml`
- Submit in Google Search Console

**Sitemap example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page1</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Canonical Tags
Prevent duplicate content issues by specifying the preferred URL.

```html
<!-- On duplicate/similar pages -->
<link rel="canonical" href="https://example.com/preferred-url">

<!-- Self-referential (optional but good practice) -->
<link rel="canonical" href="https://example.com/this-page">
```

### Meta Robots
Control indexing behavior per page.

```html
<!-- Allow indexing and following (default) -->
<meta name="robots" content="index, follow">

<!-- Prevent indexing but follow links -->
<meta name="robots" content="noindex, follow">

<!-- No indexing, no following -->
<meta name="robots" content="noindex, nofollow">
```

### Pagination Handling
Use `rel="next"` and `rel="prev"` for multi-page content.

```html
<!-- Page 1 -->
<link rel="next" href="https://example.com/page?p=2">

<!-- Page 2 -->
<link rel="prev" href="https://example.com/page?p=1">
<link rel="next" href="https://example.com/page?p=3">
```

Or use `view-all` alternative instead of pagination.

## Schema Markup

### Purpose
Schema markup (structured data) helps search engines understand page content and enables rich results (stars, snippets, etc.).

### Common Schema Types

#### Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "image": "https://example.com/image.jpg",
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}
```

#### Organization Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": ["https://twitter.com/...", "https://linkedin.com/..."]
}
```

#### Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product.jpg",
  "price": "99.99",
  "priceCurrency": "USD",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "ratingCount": "89"
  }
}
```

#### FAQ Schema
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer here."
      }
    }
  ]
}
```

### Schema Implementation
- **JSON-LD** - Recommended format (use `<script type="application/ld+json">`)
- **Microdata** - HTML attributes approach
- **RDFa** - RDF in Attributes approach

**Best practice:** Use JSON-LD for flexibility and maintainability.

### Testing Schema
- Use Google's Rich Results Test: https://search.google.com/test/rich-results
- Use Schema.org validator: https://validator.schema.org/
- Validate syntax before publishing

## Structured Data

### Breadcrumbs
Help users and search engines understand site hierarchy.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://example.com/category"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "This Page",
      "item": "https://example.com/category/page"
    }
  ]
}
```

### Open Graph Tags
Enable rich previews when content is shared on social media.

```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="article">
```

### Twitter Card
Optimize how content appears when shared on Twitter.

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Page description">
<meta name="twitter:image" content="https://example.com/image.jpg">
<meta name="twitter:creator" content="@yourhandle">
```

### Meta Tags Checklist
```
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="150-160 character description">
<meta name="theme-color" content="#ffffff">
<link rel="canonical" href="https://example.com/page">
```
