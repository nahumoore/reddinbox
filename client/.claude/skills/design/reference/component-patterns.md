# Component Patterns & Specifications

Use this as your reference when designing or reviewing individual UI components. Consistency across these elements builds a cohesive product.

## Buttons

### Primary Button (Call to Action)
**Use when:** Main action on the page (submit form, create new, save changes)
- **Style:** Solid color (brand color), white text
- **Size:** Min 44px height (mobile touch target)
- **States:** Normal, hover (darker), active (pressed feeling), disabled (grayed, no pointer)
- **Text:** Action verb (Connect, Generate, Save, not Submit)

### Secondary Button (Alternative Action)
**Use when:** Less important action (cancel, back, alternative option)
- **Style:** Outlined or lighter background
- **Size:** 44px height minimum
- **States:** All same as primary, but more subtle
- **Grouping:** Primary on right, secondary on left (LTR languages)

### Danger Button (Destructive Action)
**Use when:** Irreversible action (delete, disconnect, remove)
- **Style:** Red or warning color, white text
- **Confirmation:** Should show confirmation modal before executing
- **States:** Normal, hover, active, disabled
- **Never disabled without reason:** If user can't delete something, explain why

## Form Inputs

### Text Input
**Structure:**
```
Label (required indicator if needed)
[Input field with placeholder]
Helper text or validation message below
```

**Specifics:**
- **Label:** Always visible, not inside field
- **Placeholder:** Example value (light gray), not full instructions
- **Validation:** Show as user types or on blur
- **Focus state:** Blue border (or brand color) + shadow
- **Error state:** Red border + error message below
- **Success state:** Green checkmark or green border

### Textarea
**Use when:** Multiple lines needed (descriptions, notes)
- **Minimum height:** 100px
- **Resizable:** Should expand (not scrolling inside)
- **Character count:** Show if there's a limit
- **Same label/validation rules as text input**

### Select Dropdown
**Use when:** Choosing from predefined options
- **Options visible:** Show 3-5 common options, with "See more" or scroll
- **Empty state:** Show placeholder like "Select an option..."
- **Search:** Include search if more than 10 options
- **Mobile:** Native select on mobile, custom on desktop

### Checkbox
**Use when:** Multiple selections possible
- **Label:** Always to the right of checkbox
- **Grouping:** Vertical list, not horizontal (easier to read)
- **Indeterminate state:** Show if some sub-items selected
- **Error handling:** If required checkboxes missed, show error

### Radio Button
**Use when:** Only one selection from group
- **Mutually exclusive:** Only one can be selected
- **Label:** To the right of button
- **Grouping:** Clear visual grouping
- **Default:** Always have one option pre-selected

## Cards

### Data Card (Display Info)
**Use when:** Showing item in a list/grid (Reddit account, interaction, subreddit)
- **Structure:**
  - Header (title/name, optional image)
  - Body (key info: 2-4 pieces)
  - Footer (secondary info, timestamp)
  - Optional: Action menu (three dots, more options)
- **Hover state:** Subtle shadow increase or slight lift
- **Click behavior:** Clear (entire card clickable or just button?)

### Metric Card (Dashboard)
**Use when:** Displaying a single metric
- **Large number:** 32-48px font (scannable)
- **Label:** What does this number mean?
- **Trend:** Arrow up/down or percentage change
- **Sparkline optional:** Tiny chart showing trend over time

## Modals & Dialogs

### Confirmation Modal
**Use when:** User action needs confirmation
- **Title:** What's about to happen? ("Delete this interaction?")
- **Body:** Why are we confirming? (destructive? can't undo?)
- **Buttons:** Primary (action) on right, secondary (cancel) on left
- **Size:** 400-500px wide, centered
- **Backdrop:** Dark overlay, click outside to cancel

### Form Modal
**Use when:** Quick data entry in focused context
- **Header:** Title, close button (X)
- **Body:** Form fields (see form section above)
- **Footer:** Cancel and submit buttons
- **Size:** 400-600px depending on fields
- **Scrollable:** If form is long, make body scrollable (not whole modal)

### Alert Modal
**Use when:** Important message needs user attention
- **Tone:** Match severity (error red, success green, info blue)
- **Icon:** Visual indicator of type
- **Message:** Clear, specific, actionable
- **Button:** Single action (OK, Got it, Continue)

## Navigation

### Top Navigation Bar
**Use when:** Global navigation, accessible from anywhere
- **Height:** 56-64px
- **Content:** Logo/home link (left), main actions (right), user menu (far right)
- **Style:** Minimal, doesn't compete with content
- **Sticky:** Usually fixed at top, scrolls with page
- **Mobile:** Hamburger menu, same styling

### Sidebar Navigation
**Use when:** Multiple sections, need persistent navigation
- **Width:** 240-280px
- **Collapsible:** Can compress to icons only
- **Active state:** Highlight current section
- **Sections:** Group related items (dashboard, content, analytics, settings)
- **Icons:** Use consistently (or not at all, keep simple)

### Breadcrumbs
**Use when:** Showing location in hierarchy
- **Format:** Home > Section > Current Page
- **Clickable:** All but last item are links
- **Space:** One line, doesn't wrap
- **Use sparingly:** Not needed if sidebar shows hierarchy

## Tables

### Data Table (Sortable)
**Use when:** Comparing many items with multiple attributes
- **Header:** Bold, clickable to sort
- **Row height:** 48-56px (easy to click)
- **Hover:** Highlight entire row
- **Scrollable:** Horizontal on mobile, full width on desktop
- **Pagination:** Show 25-50 rows per page
- **Empty state:** Clear message if no data

### Dense Table (Compact)
**Use when:** Space-constrained, many rows visible
- **Row height:** 32px
- **Padding:** Minimal
- **Use case:** Admin panels, internal tools
- **Readability:** Must still be scannable

## Alerts & Notifications

### Success Alert
**Use when:** Action completed successfully
- **Color:** Green (or brand success color)
- **Icon:** Checkmark
- **Message:** What succeeded? ("Profile updated successfully")
- **Duration:** Auto-dismiss after 4-5 seconds
- **Position:** Top center or bottom right

### Error Alert
**Use when:** Something went wrong
- **Color:** Red
- **Icon:** Exclamation or X
- **Message:** What happened AND how to fix it
  - Bad: "Error occurred"
  - Good: "Failed to connect account. Check your Reddit credentials."
- **Duration:** Stay until dismissed or fixed

### Warning Alert
**Use when:** Caution, but action can proceed
- **Color:** Orange/amber
- **Icon:** Triangle warning
- **Message:** What should user be aware of?
- **Duration:** Stay visible until dismissed

### Info Alert
**Use when:** Helpful context
- **Color:** Blue
- **Icon:** Information circle
- **Message:** Tip or educational
- **Duration:** Auto-dismiss or user dismisses

## Loading States

### Skeleton Loading (Preferred)
**Use when:** Content is loading, structure is known
- **Show:** Placeholder boxes matching content shape
- **Animate:** Subtle pulse or shine effect
- **Replace:** Once real content loads, skeleton disappears
- **Better UX:** Feels faster than spinners

### Progress Indicator
**Use when:** Long operation, show progress
- **Bar:** Width shows percentage complete
- **Text:** "Analyzing 3 of 10 posts..."
- **Cancelable:** Allow user to stop if they want
- **Never estimate:** Show actual progress, not guesses

### Spinner (Use Sparingly)
**Use when:** Progress unknown, operation brief
- **Size:** 20-32px usually
- **Color:** Match brand
- **Animation:** Smooth rotation
- **Context:** Tell user what's happening ("Connecting...")

## Empty States

**When page has no data yet:**
- **Illustration:** Optional, helps soften blank page
- **Headline:** "No interactions yet"
- **Explanation:** Why is this empty? (e.g., "You haven't identified any relevant discussions yet")
- **Call to action:** What should they do? (e.g., "Start by connecting your Reddit account")
- **Size:** Large (40-56px font), centered, prominent

**Never just show blank page. Guide user what to do next.**

## Pagination

**Options:**
1. **Number pagination:** Show pages (1 2 3... 10) - Best for specific jumps
2. **Infinite scroll:** Auto-load as user scrolls - Best for discovery
3. **Load more button:** User-controlled infinite scroll - Good middle ground

**For Reddinbox analytics:** Number pagination (users want to jump to specific date ranges)
**For interaction queue:** Load more button (scrolling through interactions naturally)

**Never mix approaches on same page.**

## Tabs & Accordion

### Tabs
**Use when:** Multiple related content sections, user wants to switch between
- **Labels:** Short, descriptive ("All", "Pending", "Replied")
- **Active indicator:** Underline or background color
- **Mobile:** Horizontal scroll if many tabs, or dropdown
- **Content:** Immediately loads when tab clicked

### Accordion
**Use when:** Saving space, only one section expanded at a time
- **Headers:** Clickable, show state (arrow pointing right = closed, down = open)
- **Animation:** Smooth open/close
- **Multiple open:** Decide: allow multiple expanded or only one?
- **Icon:** Clear open/close indicator

---

## Design System Token Template

For consistency, define and reference these tokens:

```
Colors:
  Primary: #[hex]
  Secondary: #[hex]
  Error: #[hex]
  Success: #[hex]
  Warning: #[hex]

Typography:
  Heading 1: 32px, bold
  Heading 2: 24px, bold
  Body: 16px, regular
  Caption: 12px, regular

Spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px

Shadows:
  Subtle: 0 2px 4px rgba(0,0,0,0.1)
  Medium: 0 4px 12px rgba(0,0,0,0.15)
  Large: 0 8px 24px rgba(0,0,0,0.2)

Border Radius:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
```

Define once, use everywhere. This creates cohesion without effort.
