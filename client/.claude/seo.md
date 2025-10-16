SEO Best Practices

## 1. TITLE TAG OPTIMIZATION

### Best Practices

- **Length**: 50-60 characters (optimal for B2B SaaS)
- **Primary Keyword Position**: Place primary keyword within first 3-5 words
- **Include Differentiator**: Briefly communicate unique value proposition
- **Action-Oriented**: Use benefit-driven language
- **Avoid Keyword Stuffing**: Maximum 1-2 primary keywords per title

### B2B SaaS Patterns

```
Format: [Primary Keyword] - [Core Benefit] | [Brand Name]
Example: Sales Automation Software - CRM for Revenue Teams | CloseIO
```

### Examples by Page Type

**Homepage**

- Primary: [Product Name] - [Main Use Case] for [ICP]
- Bad: "Best CRM Software Platform Tools Features"
- Good: "Sales CRM for Mid-Market Revenue Teams | YourProduct"

**Feature Pages**

- Pattern: [Feature Name] - [Core Benefit] for [ICP]
- Bad: "Pipeline Management"
- Good: "Pipeline Management Tool for Sales Teams | YourProduct"

**Pricing Page**

- Pattern: [Product Name] Pricing - [Offering Type] Starting at $X
- Bad: "Pricing"
- Good: "Pricing Plans - Affordable CRM Starting at $29/month | YourProduct"

**Blog Posts (B2B SaaS)**

- Pattern: [Topic] + [Keyword] - [Data/Year if applicable]
- Bad: "Sales Guide"
- Good: "B2B Sales Automation Guide 2024 - Frameworks & Tools"

**Resource/Case Study Pages**

- Pattern: [Case Study/Resource] - [Result or Format] | [Company/Brand]
- Bad: "Customer Success Story"
- Good: "SaaS Case Study - 150% Pipeline Growth in 6 Months | YourProduct"

### Key Rules

- No CAPS (except brand names)
- Use pipes (|) or hyphens (-) as separators
- Front-load keywords before the separator
- Keep brand name at the end for homepage/main pages
- Test for CTR in Google Search Console after implementation

---

## 2. META DESCRIPTION OPTIMIZATION

### Best Practices

- **Length**: 150-160 characters (accounting for mobile truncation at 120 chars)
- **Answer the User Intent**: Directly address what the searcher wants to know
- **Include Primary Keyword Once**: Naturally integrated
- **Call-to-Action**: Optional but recommended for CTR improvement
- **Unique per Page**: Never duplicate descriptions across pages
- **Include Numbers/Data**: Boosts CTR in B2B context

### B2B SaaS Patterns

**Problem-Solution Pattern** (Best CTR for B2B)

```
Meta: [Problem statement]. [Your solution]. [Key benefit with number/timeframe].
Example: "Lose deals to slower competitors? Our sales automation platform cuts deal cycles by 30% and increases team productivity."
```

**Feature-Benefit Pattern**

```
Meta: [Feature]. [Specific business outcome]. [Timeline or metric].
Example: "Real-time pipeline visibility and collaboration tools that help teams close 40% more deals. See results in weeks, not months."
```

**Comparison/Best-Of Pattern** (High for B2B blog)

```
Meta: [Topic comparison]. [Key differentiators]. [What you'll learn].
Example: "Compare the top 5 sales CRMs for 2024. Detailed breakdown of features, pricing, and which works best for enterprise teams."
```

**Educational Pattern** (Blog content)

```
Meta: [Promise]. [Specificity]. [Who it's for].
Example: "Learn the exact sales playbook that took our customers from $0-1M ARR. Includes templates, frameworks, and case studies from 50+ B2B SaaS founders."
```

### Examples by Page Type

**Homepage**

- Bad: "Our company provides customer relationship management software"
- Good: "Sales CRM for B2B teams that cuts deal cycles by 30%. Trusted by 500+ mid-market companies. Start free today."

**Feature Page**

- Bad: "Read about our analytics features"
- Good: "Advanced sales analytics & reporting. Real-time pipeline insights that help teams spot revenue risks and optimize sales strategy."

**Pricing Page**

- Bad: "See our pricing plans"
- Good: "Simple, transparent CRM pricing with no hidden fees. Plans starting at $29/month. Compare features or get a custom quote."

**Blog Post**

- Bad: "Article about B2B SaaS sales tips"
- Good: "7 sales tactics that 100+ B2B SaaS companies used to reach $1M ARR. Data-backed strategies you can implement today."

**Case Study**

- Bad: "Customer success story"
- Good: "How TechCorp increased qualified leads by 250% in 3 months using our automation platform. Download the full case study."

### Key Rules

- Make the first 120 characters count (mobile truncation)
- Use active voice
- Include 1 metric/number when possible
- Avoid brand name repetition (assumed from title tag)
- Front-load value proposition
- Include CTA for high-intent pages (signup, pricing, resource)

---

## 3. META KEYWORDS

### B2B SaaS Approach

- **Importance**: Minimal ranking factor (1-2% impact)
- **Purpose**: Internal documentation and clarity
- **Recommendation**: Still include but don't obsess over

### Best Practice Pattern

```
Meta Keywords: [Primary keyword], [secondary keyword], [long-tail variant], [ICP-specific keyword], [problem-focused keyword]

Example:
"sales CRM, customer relationship management, sales automation software, CRM for B2B teams, sales pipeline management"
```

### Structure

- Include 5-8 keywords maximum
- Separate keywords with commas and spaces
- Start with primary keyword
- Include 1-2 long-tail variations
- Include 1 ICP-specific keyword
- Avoid stuffing unrelated keywords

---

## 4. OPEN GRAPH (OG) TAGS FOR B2B SAAS

### Why It Matters

- Controls how your link appears when shared on LinkedIn (critical for B2B)
- Improves CTR from social shares to your product
- Affects Slack preview cards, Twitter/X, Facebook

### Recommended OG Tags

```html
<!-- Required -->
<meta property="og:title" content="[Page Title - 55 chars]" />
<meta
  property="og:description"
  content="[Key value prop or summary - 155 chars]"
/>
<meta property="og:image" content="[URL to image 1200x630px]" />
<meta property="og:url" content="[Canonical URL]" />
<meta property="og:type" content="website" />

<!-- B2B SaaS Specific -->
<meta property="og:site_name" content="[Brand Name]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Image Recommendations

- **Dimensions**: 1200x630px (LinkedIn optimal)
- **Content**: Screenshot of product + key metric OR value prop + brand
- **Design**: Contrasting colors, readable text even at 200px width
- **File Format**: JPG or PNG, optimized (<200KB)
- **B2B Specific**: Include metrics, customer logos, or product in-app view

### Page-Type Specific OG Strategies

**Homepage OG**

- Image: Product dashboard screenshot with key metric overlay
- Title: Same as meta title
- Description: Core value prop + key differentiator

**Blog Post OG**

- Image: Custom graphic with headline + main takeaway number
- Title: Headline (can differ from meta title for social appeal)
- Description: Key insight or promise statement

**Case Study OG**

- Image: Before/after metric visualization
- Title: Company name + key metric achieved
- Description: The transformation or key result

**Product Launch/Feature OG**

- Image: Feature demo or product screenshot
- Title: "[Feature Name] - Available Today"
- Description: What it does + impact

---

## 5. TWITTER/X CARD TAGS

### Essential for B2B SaaS (LinkedIn execs use Twitter)

```html
<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@YourHandle" />
<meta name="twitter:title" content="[Page Title - 55 chars]" />
<meta name="twitter:description" content="[Value prop - 155 chars]" />
<meta name="twitter:image" content="[1200x630px image URL]" />
<meta name="twitter:creator" content="@YourHandle" />
```

### Card Type Recommendations

- Use `summary_large_image` for B2B SaaS (larger visual impact)
- Alternative: `summary` if image creation is constraint (not recommended for B2B)

---

## 6. STRUCTURED DATA & SCHEMA.ORG

### Critical for B2B SaaS

Structured data helps Google understand your content and can improve SERP appearance with rich snippets.

### Essential Schemas

**Organization Schema** (Homepage)

```json
{
  "@context": "https://schema.org/",
  "@type": "Organization",
  "name": "Your Product Name",
  "url": "https://yourproduct.com",
  "logo": "https://yourproduct.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/yourcompany",
    "https://twitter.com/yourhandle"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "url": "https://yourproduct.com/contact"
  }
}
```

**SoftwareApplication Schema** (Product pages)

```json
{
  "@context": "https://schema.org/",
  "@type": "SoftwareApplication",
  "name": "Your Product Name",
  "description": "[2-3 sentence description]",
  "operatingSystem": "Web, iOS, Android",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "29",
    "priceCurrency": "USD",
    "url": "https://yourproduct.com/pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "250"
  }
}
```

**BreadcrumbList Schema** (Important for navigation)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://yourproduct.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Features",
      "item": "https://yourproduct.com/features"
    }
  ]
}
```

**FAQSchema** (High CTR for featured snippets)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[FAQ Question]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Answer content]"
      }
    }
  ]
}
```

### Validation

- Test all schemas at: https://schema.org/validator or Google's Rich Results Tester
- Implement BreadcrumbList on all nested pages
- Use AggregateRating only if you have verified reviews (G2, Capterra, etc.)

---

## 7. ADDITIONAL CRITICAL META TAGS

### Viewport & Mobile

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Canonical Tag (Prevent Duplicate Content)

```html
<link rel="canonical" href="https://yourproduct.com/your-page" />
```

### Language & Robots

```html
<html lang="en" />
<meta name="robots" content="index, follow" />
```

### Content Security & Refresh

```html
<!-- Only for dynamic pricing/content pages, avoid for blogs -->
<meta http-equiv="refresh" content="3600" />
<!-- Refresh every hour -->
```

### Author & Publisher (Optional but good for credibility)

```html
<meta name="author" content="Your Company" />
<meta name="publisher" content="Your Company" />
```

---

## 8. COMMON B2B SAAS META OPTIMIZATION MISTAKES

### ❌ Avoid These

1. **Keyword Stuffing in Titles**

   - Bad: "CRM Software CRM Platform Customer Relationship Management"
   - Good: "Sales CRM for B2B Teams | YourProduct"

2. **Generic Descriptions**

   - Bad: "Learn more about our products and services"
   - Good: "Sales CRM that cuts deal cycles by 30%. Trusted by 500+ B2B companies."

3. **Duplicate Meta Descriptions**

   - Each page needs unique description
   - Audit with Screaming Frog or SEMrush

4. **Ignoring Mobile Truncation**

   - Test descriptions at 120 chars for mobile
   - Front-load value in first 60 chars

5. **Missing or Poor OG Images**

   - Use generic brand logo for all pages
   - Solution: Custom 1200x630px images per page type

6. **Forgetting About B2B Decision-Maker Intent**

   - Don't write for end-users, write for buyers
   - Include business metrics, ROI, timeline

7. **No Schema.org Implementation**

   - Missed opportunity for rich snippets
   - Minimum: Organization + SoftwareApplication schema

8. **Setting Wrong Meta Keywords**
   - Keywords don't impact ranking but show intent
   - Include ICP and problem-focused keywords

---

## 9. B2B SAAS AUDIT CHECKLIST

### On-Page Meta Audit (Per Page)

- [ ] Title: 50-60 chars, keyword in first 5 words, includes differentiator
- [ ] Meta Description: 150-160 chars, unique, includes metric or data point
- [ ] Meta Keywords: 5-8 keywords, includes ICP + problem keywords
- [ ] OG Title: Optimized for social sharing
- [ ] OG Description: Value prop clear at 155 chars
- [ ] OG Image: 1200x630px, optimized, relevant to page content
- [ ] Twitter Card: Implemented with summary_large_image
- [ ] Canonical URL: Set to prevent duplicates
- [ ] H1 Tag: Matches page intent, different from title tag
- [ ] Schema.org: At least Organization or SoftwareApplication on homepage
- [ ] Mobile-Friendly: Tested on mobile device preview

### Site-Wide Meta Audit

- [ ] Robots.txt: Correct indexing rules
- [ ] XML Sitemap: Updated with all key pages
- [ ] Internal Linking: Descriptive anchor text with keywords
- [ ] Duplicate Content: Cross-check with Screaming Frog
- [ ] Redirect Chains: None longer than 2 redirects
- [ ] HTTPS: All pages served over HTTPS
- [ ] Mobile Viewport: Properly configured

---

## 10. IMPLEMENTATION PRIORITIES FOR B2B SAAS

### Phase 1 (Week 1-2): Foundation

1. Audit current title tags (homepage, main features, pricing, blog)
2. Rewrite meta descriptions with data/metrics
3. Implement canonical tags if missing
4. Add Organization + SoftwareApplication schema

### Phase 2 (Week 3-4): Social Optimization

1. Create 1200x630px OG images for main pages
2. Implement OG tags on all pages
3. Set up Twitter Card tags
4. Test on LinkedIn and Twitter preview tools

### Phase 3 (Ongoing): Content Expansion

1. Add schema.org to blog posts (FAQSchema for featured snippets)
2. Implement BreadcrumbList on all nested pages
3. Monitor Google Search Console for CTR improvements
4. A/B test meta descriptions quarterly

---

## 11. TOOLS & RESOURCES

### Recommended Tools

- **Google Search Console**: Monitor CTR, impressions, rankings
- **Screaming Frog**: Audit all meta tags on your site
- **SEMrush**: Analyze competitor meta tags
- **Schema.org Validator**: Test structured data
- **Google Rich Results Tester**: Preview how Google shows your page
- **LinkedIn Post Inspector**: Preview OG tags on LinkedIn

### Free Browser Extensions

- Yoast SEO
- Meta SEO Inspector
- Lighthouse (built into Chrome DevTools)

---

## 12. CLAUDE CODE IMPLEMENTATION PROMPT

When using this with Claude Code, provide this instruction set:

```
You are an expert B2B SaaS SEO specialist optimizing meta tags for maximum CTR and conversion.

When generating or auditing meta tags, follow these rules:

1. TITLE TAGS: 50-60 chars, primary keyword first 5 words, include value prop differentiator
2. META DESCRIPTIONS: 150-160 chars, unique per page, include 1 metric/data point, answer user intent
3. OG TAGS: Custom 1200x630px image per page, title optimized for social, description matches intent
4. SCHEMA: Minimum Organization + SoftwareApplication on product pages, BreadcrumbList on nested pages
5. B2B FOCUS: Write for buyers and decision-makers, emphasize business outcomes and metrics
6. AVOID: Keyword stuffing, duplicate descriptions, generic claims, missing social metadata

Always test implementations against:
- Google Search Console preview
- LinkedIn Post Inspector
- Schema.org Validator
- Mobile preview (120 char description cutoff)

Generate title/description variations for A/B testing CTR when relevant.
```

---

## Questions to Ask Yourself for Each Page

Before finalizing any meta tags, ask:

1. **Intent Match**: If a B2B buyer searches for this keyword, will this title/description match their need?
2. **Differentiation**: Does my meta description clearly show how I'm different from competitors?
3. **Metric Inclusion**: Is there a number, percentage, or timeframe I can add to improve credibility?
4. **CTA Clarity**: Is it clear what action the user should take after clicking?
5. **Mobile Ready**: Does this work at 120 characters for mobile?
6. **B2B Tone**: Does this sound professional and trust-worthy for a business buyer?
7. **Shareability**: Would someone want to share this on LinkedIn?

---

**Last Updated**: October 2025  
**Version**: 1.0 for B2B SaaS  
**Applicable To**: Landing pages, product pages, blog content, resource centers, documentation
