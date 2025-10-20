---
name: Optimizing for SEO
description: Implement SEO best practices when building web pages, landing pages, and creating content. Use this when optimizing for search visibility, implementing technical SEO, or structuring content for search engines.
---

# Optimizing for SEO

## Overview

This skill guides Claude Code agents through implementing SEO best practices across three core areas: **on-page optimization**, **technical SEO**, and **content strategy**. Use this skill when:

- Building landing pages or web applications that need search visibility
- Creating blog posts, documentation, or content marketing materials
- Implementing technical improvements for crawlability and performance
- Auditing existing pages for SEO gaps
- Structuring site architecture for better authority distribution

## Core SEO Principles

### 1. Search Intent Alignment
Every page needs a clear primary keyword and matching search intent. Your content, title, and structure should directly answer the specific question users are searching for—not just contain keywords.

### 2. On-Page Fundamentals
Your page title, meta description, H1 heading, and URL structure are the foundation. These must be optimized, descriptive, and keyword-focused to signal relevance to search engines.

### 3. Technical Soundness
A page can have perfect content but fail if Google can't crawl it properly or if it loads slowly. Core Web Vitals, mobile responsiveness, and clean HTML structure matter equally to content.

### 4. Topical Authority
Search engines reward sites that build authority on specific topics. Internal linking, related content, and consistent coverage of a topic cluster build this authority signal.

### 5. Content Quality & Structure
Comprehensive, well-structured content that covers user intent thoroughly ranks better. Use clear hierarchy, examples, and scannability to improve both rankings and user experience.

## Quick Reference: Before Publishing Any Page

- [ ] **Title tag** - 50-60 characters, primary keyword first, compelling
- [ ] **Meta description** - 150-160 characters, includes keyword, describes page value
- [ ] **H1 heading** - One per page, matches title concept, descriptive
- [ ] **URL structure** - Lowercase, hyphenated, includes target keyword
- [ ] **Mobile responsive** - Functions perfectly on mobile devices
- [ ] **Page speed** - Passes Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] **Internal linking** - Links to 3-5 related pages with keyword anchor text
- [ ] **Content length** - Comprehensive for the topic (typically 1,500+ words for competitive topics)
- [ ] **Images optimized** - Compressed, descriptive alt text, responsive

## When Multiple Approaches Exist

SEO allows flexibility based on context:

- **Target audience vs. search volume** - Build authority in your niche even if search volume is smaller
- **New vs. established sites** - New sites should focus on long-tail, less competitive keywords
- **Topic depth vs. page count** - Fewer comprehensive pages outrank many shallow pages on the same topic
- **Content format** - Some topics perform better as guides, others as quick references

Ask yourself: "What does this specific user need, and what does Google reward for this intent?"

## Detailed Guides

Each area of SEO has specific implementation patterns:

- **[On-Page SEO](reference/on-page-seo.md)** - Title tags, meta descriptions, heading structure, content optimization
- **[Technical SEO](reference/technical-seo.md)** - Page speed, Core Web Vitals, mobile optimization, schema markup, crawlability
- **[Content SEO](reference/content-seo.md)** - Keyword research, content strategy, internal linking, topical authority
- **[SEO Workflows](reference/seo-workflows.md)** - Step-by-step processes for common optimization tasks
- **[SEO Checklists](reference/seo-checklist.md)** - Pre-launch and ongoing optimization checklists

## Common Scenarios

### "I need to optimize an existing page for better rankings"
1. Review the page's current target keyword and search intent
2. Use [Content SEO](reference/content-seo.md) to identify keyword gaps
3. Check [On-Page SEO](reference/on-page-seo.md) for optimization opportunities
4. Reference [SEO Checklists](reference/seo-checklist.md) to catch missing fundamentals

### "I'm building a new landing page"
1. Start with [Content SEO](reference/content-seo.md) - research target keyword and intent
2. Follow [SEO Workflows](reference/seo-workflows.md) - launch optimization workflow
3. Implement patterns from [On-Page SEO](reference/on-page-seo.md)
4. Verify technical requirements in [Technical SEO](reference/technical-seo.md)
5. Use [SEO Checklists](reference/seo-checklist.md) before publishing

### "Page is loading slowly or has Core Web Vitals issues"
Review [Technical SEO](reference/technical-seo.md) - Core Web Vitals section for specific optimization patterns.

### "Unsure which keywords to target"
Follow the keyword research workflow in [Content SEO](reference/content-seo.md) - Keyword Research section.

## Important Notes

- SEO is not about manipulation or gaming rankings—it's about making content discoverable to the right audience
- Focus on user intent first, keyword rankings second
- Sustainable rankings come from genuine expertise, authority, and comprehensive content
- Search algorithms constantly evolve, but these fundamentals remain stable
- Quick wins exist (on-page optimization), but sustainable rankings take weeks to months to materialize

## Key Terminology

- **Search intent** - The underlying reason someone searches for a keyword (informational, commercial, transactional, navigational)
- **Primary keyword** - The main keyword phrase you're optimizing a page for
- **Long-tail keyword** - More specific, lower-volume keywords typically easier to rank for
- **SERP** - Search Engine Results Page
- **Core Web Vitals** - Google's ranking factors measuring page experience (LCP, FID, CLS)
- **Topical authority** - A site's credibility and coverage depth on a specific topic
- **Internal linking** - Links within your site that connect related pages
- **Schema markup** - Structured data that helps search engines understand page content
