# On-Page SEO Reference

## Table of Contents
- [Title Tags](#title-tags)
- [Meta Descriptions](#meta-descriptions)
- [Heading Structure](#heading-structure)
- [URL Structure](#url-structure)
- [Content Optimization](#content-optimization)
- [Internal Linking](#internal-linking)
- [Image Optimization](#image-optimization)

## Title Tags

### Purpose
Title tags are the first ranking factor and appear as the clickable headline in search results. They signal primary topic and relevance to both search engines and users.

### Best Practices
- **Length** - 50-60 characters (optimal for display, can go to 70 for important pages)
- **Keyword placement** - Put primary keyword at the beginning or early in the title
- **Keyword exact match vs. variation** - Include keyword exactly or natural variation
- **Branding** - Add brand name at end only if space permits (e.g., "Best React Hooks Guide | YourBrand")
- **Uniqueness** - Never duplicate title tags across pages
- **Readability** - Write for humans first, search engines second—avoid keyword stuffing

### Examples

**Good:**
- "React Hooks Best Practices: 2025 Guide" (60 chars, keyword first, value-driven)
- "How to Build a SaaS MVP in 2 Months | Validation Blueprint" (59 chars, intent-matched)

**Avoid:**
- "React Hooks | React | React Tutorial | React Guide" (keyword stuffing)
- "Page" or "Untitled" (no value, no keyword)
- "The Ultimate Comprehensive Complete Guide to Everything About React" (too long, no keyword focus)

### Formula That Works
**[Primary Keyword] [Modifier/Format] [Value/Result]**
- Examples: "Next.js Performance Optimization: Complete Guide"
- "Product Launch Checklist: Ship Like a Startup"
- "Supabase vs Firebase: Real-Time Database Comparison"

## Meta Descriptions

### Purpose
Meta descriptions don't directly affect rankings but heavily influence click-through rates from search results. They're your sales pitch to get someone to click.

### Best Practices
- **Length** - 150-160 characters (desktop), some SERP variations show 120-170
- **Call to action** - Include action words: "Learn," "Discover," "Get," "Find"
- **Keyword inclusion** - Include primary keyword when natural, not forced
- **Unique** - Never duplicate; each page needs custom description
- **Accurate** - Describe what users will actually find (avoid clickbait)
- **Value prop** - Clearly state why someone should click

### Examples

**Good:**
- "Learn the 7 most important React Hooks with practical examples. Covers useState, useEffect, useContext, and advanced patterns for production apps."
- "Complete SaaS validation framework including customer discovery, problem validation, and go-to-market strategy. Step-by-step playbook."

**Avoid:**
- "This page is about React Hooks and includes information about React" (repetitive, no value)
- "Click here to learn more" (vague, no specifics)
- Meta description longer than 160 characters (will truncate in results)

### Formula That Works
**[Value] + [Format/Benefit] + [CTA]**
- "Discover the 5-step process to validate your SaaS idea with real customers. Includes templates and examples. Start validating today."

## Heading Structure

### Purpose
Heading hierarchy (H1, H2, H3) helps search engines understand content structure and topic relevance. It also improves readability and user experience.

### Rules
- **One H1 per page** - Your primary topic heading
- **H1 matches title concept** - Should relate directly to page title, not be identical
- **Logical hierarchy** - H2 > H3 > H4, never skip levels (don't jump from H1 to H3)
- **Keyword in H1** - Include primary keyword in H1
- **Secondary keywords in H2s** - Related keywords and subtopics in section headings

### Structure Example

**Page Title:** "React Hooks Best Practices: 2025 Guide"

```
<h1>React Hooks Best Practices</h1>

<h2>Understanding useState Hook</h2>
<h3>Basic Implementation</h3>
<h3>Common Mistakes</h3>

<h2>Advanced useEffect Patterns</h2>
<h3>Dependency Arrays Explained</h3>
<h3>Cleanup Functions</h3>

<h2>Custom Hooks for Reusability</h2>
<h3>Creating Your First Custom Hook</h3>
<h3>Sharing Logic Across Components</h3>
```

### Best Practices
- Keep headings descriptive (explain what user will learn)
- Use natural language (not keyword-stuffed)
- Avoid excessive nesting (max 3 levels typically)
- Each major section should have an H2

## URL Structure

### Best Practices
- **Lowercase** - Always use lowercase letters
- **Hyphens only** - Use hyphens to separate words, never underscores
- **Keyword inclusion** - Include primary keyword in URL when possible
- **No special characters** - Only letters, numbers, hyphens, and forward slashes
- **Descriptive** - URLs should be human-readable and indicate content topic
- **Consistent structure** - Follow pattern across site (e.g., /blog/[slug], /resources/[slug])

### Examples

**Good URLs:**
- `/blog/react-hooks-best-practices` (keyword-rich, clear topic)
- `/resources/saas-validation-checklist` (descriptive, logical)
- `/docs/getting-started` (intuitive hierarchy)

**Avoid:**
- `/blog/123456` (meaningless number)
- `/blog/React_Hooks` (underscores, mixed case)
- `/blog/react-hooks-best-practices-guide-2024-update-final-version` (too long)
- `/page.php?id=42&ref=header` (technical parameters exposed)

### Strategy
- **Root level important** - `/react-hooks` better than `/blog/code/tutorials/react-hooks`
- **Maximum depth** - Usually 2-3 levels is ideal
- **Never change URLs** - Use redirects if you must change URL structure

## Content Optimization

### Keyword Integration
- **Keyword density** - Natural keyword usage (appears 1-2% of word count, not forced)
- **First paragraph** - Include primary keyword in first 100 words
- **Throughout content** - Distribute naturally across headings and sections
- **Variations** - Use semantic variations and related keywords naturally
- **Don't force** - Forced keywords hurt readability and rankings

### Content Length
- **Target** - 1,500-3,000 words for competitive topics, 800-1,500 for less competitive
- **Not padding** - Length should come from comprehensiveness, never filler
- **E-E-A-T signals** - Experience, expertise, authority, trustworthiness increase with depth
- **Format matters** - Lists, examples, and code snippets reduce perceived length

### Content Structure
- **Opening hook** - First paragraph answers the search intent immediately
- **Table of contents** - For longer pieces, helps scannability
- **Short paragraphs** - 2-3 sentences typical
- **Bullet points** - Use for lists and key takeaways
- **Subheadings** - Clear H2/H3 hierarchy
- **Visual breaks** - Images, code blocks, callouts every 300-400 words

### Fresh & Updated Content
- **Update dates** - Include publication and last-updated dates
- **Evergreen focus** - Build content that remains relevant (avoid time-sensitive unless intended)
- **Refresh strategy** - Annually update top-performing pages with new examples and data
- **Version notes** - For technical content, note which versions the guide covers

## Internal Linking

### Purpose
Internal links distribute authority across your site and help search engines understand site structure and topic relationships.

### Best Practices
- **Contextual linking** - Links appear within content naturally, not just in sidebar/footer
- **Anchor text** - Use descriptive keyword-rich anchor text, not "click here"
- **Target relevance** - Link to pages that actually relate to the topic
- **Quantity** - 3-5 internal links per 1,500 word article is typical
- **Link fresh content** - New pages benefit from links from existing authority pages

### Internal Linking Strategy
- **Hub & spoke model** - Link related content to a pillar page that establishes authority
- **Topic clusters** - Link pages that cover related aspects of a topic
- **Hierarchy** - Link from general to specific, homepage to category to detail
- **Bidirectional** - If page A links to B, consider if B should link back to A

### Examples

**Good anchor text:**
- "Learn more about [React Hooks patterns](link)" ✓
- "Follow the [SaaS validation framework](link)" ✓
- "See [how to set up Supabase](link)" ✓

**Avoid:**
- "Click here for more info" ✗
- "Link" ✗
- Exact match keyword every link ✗

## Image Optimization

### File Optimization
- **Format** - Use WebP for modern browsers (with PNG/JPG fallback), JPG for photos
- **Compression** - Compress without visible quality loss (tools: TinyPNG, Squoosh)
- **Size** - Keep file sizes under 300KB for web images
- **Dimensions** - Use proper image dimensions (don't scale large images down in HTML)

### Alt Text
- **Purpose** - Accessibility and SEO signal
- **Descriptive** - Clearly describe what the image shows
- **Keyword optional** - Include keyword if natural, don't force it
- **Length** - Usually 1-3 sentences, avoid keyword stuffing

### Alt Text Examples

**Good:**
- "Dashboard showing real-time analytics with revenue trending upward 25%"
- "React component lifecycle diagram showing mounting and updating phases"

**Avoid:**
- "image" or "pic" (meaningless)
- "React hooks best practices guide tutorial" (keyword stuffing)
- Extremely long descriptions

### Responsive Images
- **Srcset** - Provide multiple image sizes for responsive loading
- **Picture element** - Use for format switching (WebP with JPG fallback)
- **Lazy loading** - Use `loading="lazy"` for below-fold images
- **Aspect ratio** - Maintain aspect ratio to prevent layout shift
