---
name: Designing UI & UX for Web Applications
description: Best practices for creating user-centered, accessible, and consistent web interfaces that solve real user problems and scale with your product
---

# Designing UI & UX for Web Applications

This Skill guides design decisions for web applications, focusing on user needs, consistency, and accessibility. Use this when building or reviewing interfaces for Reddinbox or similar SaaS products.

## 🎯 Core Design Principles

### 1. User-Centered Design
Every interface should solve a specific user problem, not showcase design aesthetics. Before designing anything, ask:
- **Who is this for?** (What's their job, frustration, or goal?)
- **What are they trying to accomplish?** (Be specific)
- **How will they know if it worked?** (Success metrics)
- **What could go wrong?** (Error states, edge cases)

For Reddinbox, users are either Reddit authority builders or lead generators. They want to know: "Is my strategy working?" and "Who's interested in what I offer?" Design around those questions first.

### 2. Design System Over One-Offs
Every new design decision should reference your design system. If something doesn't exist in your system, add it systematically rather than creating random variations.

**Your system should define:**
- Color palette (primary, secondary, semantic colors like error, success, warning)
- Typography scale (headings, body text, captions with consistent sizing)
- Spacing system (use multiples of 4px or 8px, not random values)
- Component library (buttons, inputs, cards, modals, etc.)
- Responsive breakpoints (mobile, tablet, desktop)

**Benefit:** Consistency builds trust. Users learn patterns faster and need less explanation.

### 3. Information Hierarchy
Not all information is equal. Guide users' attention using:

- **Size** - Important info is larger
- **Color** - Use sparingly; colors direct focus
- **Contrast** - Important elements stand out against backgrounds
- **Whitespace** - Breathing room reduces cognitive load
- **Position** - Top-left is scanned first in left-to-right languages

Example: In Reddinbox's interaction dashboard, surface "actions needed" prominently, hide low-priority metrics below the fold.

### 4. Feedback & Feedback Loops
Users need to know what happened after every action. Design for all these states:

- **Normal state** - Default, nothing special happening
- **Loading state** - Action in progress (spinner, skeleton, progress indicator)
- **Success state** - Action completed (confirmation message, state change)
- **Error state** - Something went wrong (clear explanation + how to fix)
- **Empty state** - No data yet (explain what goes here + how to populate it)

**Rule:** Never leave users wondering if their click registered.

### 5. Accessibility First
Accessible design isn't a feature—it's a requirement. 10-15% of users have accessibility needs.

**Minimum standards:**
- Color contrast ratio at least 4.5:1 for text (WCAG AA)
- All interactive elements keyboard-accessible (Tab navigation)
- Form fields clearly labeled (not just placeholder text)
- Images have alt text describing their purpose
- Focus indicators visible (don't hide with `outline: none`)
- Error messages associated with form fields (not just red borders)

See `accessibility-checklist.md` for detailed audit criteria.

## 🏗️ Interface Organization Patterns

### The Three-Layer Pattern (Most Common for SaaS)
Most web app interfaces follow this structure:

1. **Top Navigation** - Account, settings, search (minimal, consistent)
2. **Sidebar or Tab Navigation** - Main sections (dashboard, content, analytics, settings)
3. **Main Content Area** - Primary task and data

For Reddinbox: Navigation → Section (e.g., "Interactions") → Content (specific interaction details)

### The Card/Grid Pattern
Use cards when displaying multiple similar items (Reddit communities to monitor, interactions pending review, etc.).

**When to use cards:**
- Multiple items of the same type
- Each item has similar information structure
- User might want to take action on individual items

**When to avoid cards:**
- Dense comparison tables (use actual tables)
- Single item with lots of data (use full-width layouts)
- Forms (too much whitespace feels empty)

### Form Design Pattern
Forms are where users drop off. Design them to minimize friction:

- **One column when possible** (vertical flow is natural)
- **Label above input** (easier to scan than labels inside)
- **Progressive disclosure** (hide advanced options, show essentials first)
- **Clear primary action** (bigger, more prominent button)
- **Indicate required fields** (use asterisk or "required" label, not just red)
- **Validate inline** (don't wait for submit to tell users they made a mistake)
- **Show error context** (bad: "Invalid input" | good: "Username must be 3-20 characters")

For Reddinbox: Reddit account connection form should ask for minimum required info upfront, save complex settings for later.

## 📱 Responsive Design Thinking

Design mobile-first, then enhance for larger screens. This forces you to prioritize what's essential.

**Mobile first process:**
1. Design for 375px width (iPhone SE)
2. Add breakpoints at 768px (tablets) and 1024px (desktop)
3. Each breakpoint can reorganize or reveal hidden content—don't just hide things

**Common patterns:**
- Navigation: hamburger menu mobile → horizontal nav desktop
- Layout: single column mobile → multi-column desktop
- Tables: horizontal scroll mobile → full table desktop
- Modals: full-screen mobile → centered modal desktop

For Reddinbox dashboard: Show most critical metric on mobile, reveal secondary metrics on desktop.

## 🎨 Design System Components

See `component-patterns.md` for detailed specifications on implementing these with consistency:

- Buttons (primary, secondary, danger states)
- Form inputs (text, textarea, select, checkbox, radio)
- Cards (data containers)
- Modals (focused tasks, confirmations)
- Alerts (success, warning, error)
- Navigation (primary, secondary, breadcrumbs)
- Tables (sortable, filterable)
- Pagination and infinite scroll
- Tabs and accordion (content organization)

**Rule:** If it exists in your system, copy it. Don't recreate buttons or inputs.

## ❌ Common Design Anti-Patterns to Avoid

See `design-anti-patterns.md` for detailed explanations, but avoid:

- Auto-playing videos or animations
- Surprising navigation that moves or hides
- Disabled buttons without explanation
- Forms that reset after validation errors
- Too many colors or visual styles competing for attention
- Hover-only actions (mobile users can't hover)
- Infinite scroll without a "scroll to top" option
- Outdated loading states (don't use spinning loaders without text)

## 🔄 Design Validation Workflow

Before sending design to code, validate with actual users:

1. **Create a prototype** (Figma wireframe, clickable prototype)
2. **Ask specific questions** - Don't ask "Do you like this?" Ask "How would you...?"
3. **Watch user behavior** - Where do they click first? What confuses them?
4. **Document issues** - Note confusing interactions, unclear labels, missing states
5. **Iterate** - Fix the top 3 issues and validate again

Time investment: 30 minutes of user testing beats weeks of guessing.

## 📊 State Management in Interfaces

Every element can be in multiple states. Plan for all:

**Example: "Connect Reddit Account" button**
- **Normal:** Blue button, ready to click
- **Loading:** Button disabled, spinner inside
- **Success:** Green checkmark, message "Account connected"
- **Error:** Red button, message "Failed to connect. Retry?"
- **Connected:** Button becomes "Disconnect" (different style)

Don't just design the happy path. Design every state.

## 🎯 For Reddinbox Specifically

**Key interface patterns:**
- Dashboard showing Reddit profile stats and engagement trends
- Interaction queue (pending responses to qualify)
- Analytics dashboard tracking authority growth
- Subreddit priority matrix (audience fit vs opportunity size)
- Settings for account management and notification preferences

**User decision points:**
- "Should I respond to this post?" (show relevance score, audience quality)
- "Which subreddits matter most?" (show potential, current performance)
- "Did my strategy work?" (clear metrics over time, not just today)

Design around these questions before worrying about colors or buttons.

---

## Reference Files

- **`component-patterns.md`** - Detailed specifications for buttons, forms, cards, navigation, tables, modals
- **`accessibility-checklist.md`** - WCAG compliance audit guide and implementation checklist
- **`design-anti-patterns.md`** - Detailed explanations of 15+ patterns to avoid with examples

## When to Use This Skill

- Designing new interface sections or features
- Reviewing existing UI for consistency and usability
- Creating design specifications before handing off to development
- Auditing current design for accessibility gaps
- Planning information architecture for new dashboards
- Making decisions about forms, navigation, or data presentation
