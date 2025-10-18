# UI/UX Design Guidelines for AI Agents

## Core Principles

1. **Mobile-First**: Design for 320px+ first, enhance for larger screens
2. **Accessibility is Required**: WCAG 2.2 AA compliance is non-negotiable
3. **Clarity Over Aesthetics**: Users must understand instantly what to do
4. **Consistency**: Same patterns and styles throughout
5. **Immediate Feedback**: Every interaction gets visual confirmation

---

## Accessibility Requirements (WCAG 2.2 AA)

### Color Contrast
- Normal text: **4.5:1 minimum** ratio
- Large text (18pt+ or 14pt+ bold): **3:1 minimum**
- UI components: **3:1 minimum**
- Never rely on color alone (add icons, patterns, or text)

Tailwind: Use `text-gray-900 bg-white` ✅, avoid `text-gray-400 bg-gray-100` ❌

### Keyboard Navigation
- All functionality must work with keyboard only
- Visible focus indicators on all interactive elements
- Tab order follows logical reading order
- No keyboard traps

Tailwind: `focus:ring-2 focus:ring-blue-500 focus:outline-none`

### Touch Targets
- **Minimum: 44x44px** (WCAG 2.2 requirement)
- Recommended: 48x48px
- Spacing: 8px minimum between targets

Tailwind: `min-w-[44px] min-h-[44px] p-3`

### Semantic HTML
- One `<h1>` per page
- Don't skip heading levels (h1 → h2 → h3, never h1 → h3)
- Use landmarks: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- Proper labels for all form inputs

### Images & Media
- All meaningful images need descriptive alt text
- Decorative images: empty alt attribute `alt=""`
- Videos require captions
- No flashing content (seizure risk)

---

## Responsive Design

### Breakpoints (Tailwind)
- **Mobile**: 320-768px (default styles)
- **Tablet**: `md:` prefix (768px+)
- **Desktop**: `lg:` prefix (1024px+)
- **Wide**: `xl:` prefix (1280px+)

Example: `text-sm md:text-base lg:text-lg`

### Mobile-First Layout
- Single column on mobile
- Stack elements vertically
- Full-width containers
- Collapsible navigation
- No horizontal scrolling

### Essential Meta Tag
Always include: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## Typography

### Type Scale
- **Base: 16px** (body text - never smaller on mobile)
- **Small: 14px** (secondary info)
- **Large: 18-20px** (prominent text)
- **XL: 24px** (subheadings)
- **2XL: 30-36px** (section headings)
- **3XL+: 48px+** (hero headings)

Tailwind: `text-base`, `text-sm`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`

### Readability
- **Line height**: 1.5-1.8 for body text (Tailwind: `leading-relaxed`)
- **Line length**: 50-75 characters max (Tailwind: `max-w-prose`)
- **Paragraph spacing**: `space-y-4` or `space-y-6`

### Font Weights
- Regular (400): Body text
- Semibold (600): Subheadings, labels
- Bold (700): Headings, critical info

Tailwind: `font-normal`, `font-semibold`, `font-bold`

---

## Color System

### Semantic Colors
- **Red/Danger**: Errors, deletion (`bg-red-600`, `text-red-600`)
- **Yellow/Warning**: Caution, alerts (`bg-yellow-500`, `text-yellow-700`)
- **Green/Success**: Confirmations (`bg-green-600`, `text-green-600`)
- **Blue/Info**: General info (`bg-blue-600`, `text-blue-600`)

### Usage
- 60%: Whitespace and backgrounds
- 30%: Content
- 10%: Accent colors and CTAs

---

## Spacing (8-Point Grid)

### Scale
- `space-y-1` (4px): Tight spacing
- `space-y-2` (8px): Minimum spacing
- `space-y-4` (16px): Base spacing
- `space-y-6` (24px): Medium spacing
- `space-y-8` (32px): Large spacing
- `space-y-16` (64px): Major sections
- `space-y-24` (96px): Hero spacing

### Component Spacing
- Buttons: `px-4 py-2` or `px-6 py-3`
- Cards: `p-4` or `p-6`
- Page margins: `px-4 md:px-6 lg:px-8`
- Container: `container mx-auto px-4`

---

## Interactive Elements

### Buttons

**Hierarchy:**
- Primary: `bg-blue-600 text-white hover:bg-blue-700`
- Secondary: `border-2 border-blue-600 text-blue-600 hover:bg-blue-50`
- Tertiary: `text-blue-600 hover:underline`
- Danger: `bg-red-600 text-white hover:bg-red-700`

**States:**
```
hover:bg-blue-700
active:bg-blue-800
focus:ring-2 focus:ring-blue-500
disabled:opacity-50 disabled:cursor-not-allowed
```

**Sizing:**
- Small: `px-3 py-1.5 text-sm` (min-height: 36px)
- Medium: `px-4 py-2` (min-height: 44px) ✅ Default
- Large: `px-6 py-3 text-lg` (min-height: 48px)

### Links
- Clearly distinguish from text: `text-blue-600 underline hover:text-blue-800`
- Always include focus ring: `focus:ring-2 focus:ring-blue-500`
- Descriptive text (not "click here")

### Form Inputs
```
border-2 border-gray-300 rounded px-4 py-3
focus:border-blue-500 focus:ring-2 focus:ring-blue-200
min-h-[44px]
```

- Always have visible labels (not placeholders)
- Mark required fields with asterisk (*)
- Inline validation where appropriate
- Clear, specific error messages

---

## Forms Best Practices

### Layout
- Labels above inputs (vertical forms preferred)
- Group related fields
- Only ask for essential information

### Validation
- Validate as user types (where appropriate)
- Position errors near relevant field: `text-red-600 text-sm mt-1`
- Specific errors: "Email must include @" ✅ not "Invalid" ❌
- Show success states

### Input Types
Use appropriate types for mobile keyboards:
- `type="email"` - email keyboard
- `type="tel"` - number pad
- `type="date"` - date picker
- `type="number"` - number controls

---

## Component Patterns

### Container Layout
```
<div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
```

### Grid
```
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Card
```
<div class="bg-white rounded-lg shadow p-6 space-y-4">
```

### Section Spacing
```
<section class="py-16 md:py-24">
```

---

## Common Mistakes to Avoid

### ❌ Critical Errors
1. **Low contrast text** - Always check 4.5:1 ratio
2. **Tiny touch targets** - Minimum 44x44px
3. **Missing alt text** - Required for all meaningful images
4. **No focus indicators** - Required for keyboard navigation
5. **Placeholders as labels** - Use proper `<label>` elements
6. **Missing viewport meta tag** - Mobile will break
7. **Text under 16px on mobile** - Hard to read
8. **Removing outline without replacement** - Accessibility violation
9. **Color-only indicators** - Add icons or text
10. **No keyboard navigation** - Must work without mouse

### ❌ Design Errors
- Multiple competing CTAs (one primary action per page)
- Inconsistent button styles
- Auto-playing media
- Horizontal scrolling on mobile
- Hover-only interactions
- Generic link text ("click here")
- All caps for long content
- Justified body text

---

## Quick Launch Checklist

### Must Have
- [ ] Color contrast meets 4.5:1 (normal text)
- [ ] All interactive elements minimum 44x44px
- [ ] Visible focus indicators on all interactive elements
- [ ] All images have alt text
- [ ] Forms have proper labels
- [ ] Works with keyboard only
- [ ] Viewport meta tag included
- [ ] No text under 16px on mobile
- [ ] One h1 per page, proper heading hierarchy
- [ ] Semantic HTML (header, nav, main, footer)
- [ ] Responsive on 320px width
- [ ] No horizontal scrolling on mobile

### Performance
- [ ] LCP under 2.5 seconds
- [ ] CLS under 0.1
- [ ] Images compressed and optimized
- [ ] Font loading optimized

### UX
- [ ] One clear primary action per page
- [ ] Loading states for async actions
- [ ] Specific error messages
- [ ] Success confirmations after submissions
- [ ] Mobile navigation works well

---

## Layout Hierarchy

### Z-Index Scale (stick to this)
- 0: Base content
- 10: Dropdowns
- 20: Sticky elements
- 30: Fixed headers
- 40: Modal backdrops
- 50: Modals
- 60: Tooltips

### Reading Patterns
- **F-Pattern**: Users scan top horizontal, left vertical, second horizontal
- **Z-Pattern**: Top-left → top-right → diagonal → bottom-left → bottom-right
- **Implication**: Front-load important info, make first words count

---

## Performance Guidelines

### Images
- Hero images: Under 200KB
- Content images: Under 100KB
- Thumbnails: Under 30KB
- Use WebP format
- Lazy load off-screen images
- Always provide width/height attributes

### Animations
- Use transforms and opacity only (GPU-accelerated)
- Respect reduced motion: `motion-reduce:transition-none`
- Keep under 300ms for UI transitions

---

## Mobile-Specific Rules

1. **Base font: 16px minimum** (prevents zoom on iOS)
2. **Touch targets: 44px minimum** with 8px spacing
3. **Design for thumbs**: Bottom 1/3 of screen is easiest to reach
4. **No hover-only interactions**
5. **Collapsible navigation** (hamburger menu or bottom tabs)
6. **Stack content vertically**
7. **Large, tappable areas**

---

## Tailwind Quick Reference

### Common Patterns
```
// Button
bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700
focus:ring-2 focus:ring-blue-500 focus:outline-none
min-h-[44px] min-w-[44px]

// Input
border-2 border-gray-300 rounded px-4 py-3
focus:border-blue-500 focus:ring-2 focus:ring-blue-200
min-h-[44px]

// Card
bg-white rounded-lg shadow p-6 space-y-4

// Container
container mx-auto px-4 md:px-6 lg:px-8

// Grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

// Link
text-blue-600 underline hover:text-blue-800
focus:ring-2 focus:ring-blue-500
```

---

## Final Rules

1. **Mobile-first is required** - 60%+ of traffic is mobile
2. **Accessibility is non-negotiable** - Legal requirement by 2026
3. **Users scan, they don't read** - Use headings, short paragraphs
4. **Consistency builds trust** - Same patterns everywhere
5. **Test with keyboard** - Tab through everything
6. **Performance is UX** - Slow = bad experience
7. **Less is more** - Remove until it breaks
8. **Provide immediate feedback** - Every action needs confirmation

---

**Version**: 2.0 (Condensed for AI Agents)
**Standards**: WCAG 2.2 AA, Mobile-First, Tailwind CSS
