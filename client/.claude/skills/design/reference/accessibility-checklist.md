# Accessibility Checklist (WCAG 2.1 Level AA)

Use this before design handoff to development. Accessibility isn't optional—it's legally required in many jurisdictions and ethically essential.

## Quick Self-Audit (5 minutes)

- [ ] Can I navigate entire page using only keyboard (Tab, Enter, Arrow keys)?
- [ ] Do all buttons/links have clear focus indicators (not just color)?
- [ ] Are form labels visible (not just inside inputs)?
- [ ] Do error messages explain what's wrong AND how to fix?
- [ ] Is text readable? (Contrast passes WCAG AA at minimum)
- [ ] Do images have meaningful alt text (not just "image")?
- [ ] Can I resize text to 200% without breaking layout?
- [ ] Is information conveyed in color also shown another way (icon, shape, text)?

If you answered "no" to any, read the detailed section below.

---

## 1. Color & Contrast

### Text Contrast
**Requirement:** Text must have at least 4.5:1 contrast ratio against background (WCAG AA)

**What this means:**
- Dark text on light background: easier to meet
- Light text on dark background: easier to meet
- Avoid: light gray on white, dark gray on black
- Tool: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**For Reddinbox:**
- Primary text (body): #1F2937 on #FFFFFF (contrast: 12.6:1 ✓)
- Secondary text (caption): #6B7280 on #FFFFFF (contrast: 7.0:1 ✓)
- Error text: Use red (#DC2626) on white: (contrast: 5.8:1 ✓)

### Don't Use Color Alone
**Problem:** 8% of men are colorblind. Color alone isn't enough to convey meaning.

**Bad examples:**
- "Error" = red box, nothing else
- "Success" = green checkmark, no text
- "Pending" = yellow highlight, no indicator

**Good examples:**
- "Error" = red box + "⚠ Error:" text + explanation
- "Success" = green checkmark + "✓ Saved" text
- "Pending" = yellow badge + "⏱ Pending" text + timestamp

**Rule:** Always pair color with text, icon, or pattern.

---

## 2. Keyboard Navigation

### Tab Order Must Make Sense
**Requirement:** Users navigating with Tab should go left-to-right, top-to-bottom

**Test:**
1. Open page in browser
2. Press Tab repeatedly, don't use mouse
3. Does focus go in logical order?
4. Can you reach all interactive elements?

**Common issues:**
- Focus jumps around randomly (usually from CSS `z-index` confusion)
- Interactive elements not in tab order (using `<div>` instead of `<button>`)
- Can't get out of a modal with Tab
- Focus trapped in dropdown, can't escape

**Fix:** Review HTML structure. Elements should be in tab order in source code.

### Focus Indicators Must Be Visible
**Requirement:** Every interactive element needs a visible focus indicator (not just color)

**Bad:**
```css
button:focus {
  outline: none; /* DON'T DO THIS */
  color: blue;
}
```
*(Colorblind users can't see the blue change)*

**Good:**
```css
button:focus {
  outline: 2px solid #3B82F6; /* Visible outline */
  outline-offset: 2px; /* Space from element */
}
```

**Rule:** Default browser focus (outline) is ugly but accessible. If you customize it, must be clearly visible for colorblind users too.

### Clickable Elements Must Be Keyboard Accessible
**Requirement:** All actions via mouse must also work via keyboard

**Examples:**
- Button → works with Enter or Space
- Link → works with Enter
- Dropdown → opens with Enter or Space, navigates with Arrow keys
- Modal close button → works with Escape key
- Hover menus → must be keyboard accessible (open with Focus)

**Never do:**
```html
<!-- BAD: div isn't keyboard accessible by default -->
<div onclick="deleteItem()">Delete</div>

<!-- GOOD: button is keyboard accessible -->
<button onclick="deleteItem()">Delete</button>
```

---

## 3. Form Accessibility

### Every Input Needs a Label (Visible)
**Bad:**
```html
<!-- Placeholder is NOT a label -->
<input type="email" placeholder="Email address">
```

**Good:**
```html
<label for="email">Email address</label>
<input type="email" id="email" placeholder="you@example.com">
```

**Why:** Screen reader users need explicit label. Placeholder disappears when typing.

### Indicate Required Fields
**Options:**
- Add asterisk: `<label>Email address <span aria-label="required">*</span></label>`
- Add text: `<label>Email address (required)</label>`
- Both is fine too

**Don't rely on color alone** (asterisk must be visible or have aria-label).

### Error Messages Must Be Associated
**Bad:**
```html
<input type="email" name="email">
<span style="color: red;">Invalid email format</span>
```
*(Screen reader won't know this error is for that field)*

**Good:**
```html
<label for="email">Email address</label>
<input type="email" id="email" aria-describedby="email-error">
<span id="email-error" role="alert" style="color: red;">Invalid email format</span>
```

**How it works:** `aria-describedby="email-error"` links the error to the input. Screen reader reads: "Email address, invalid email format."

### Error Messages Must Be Clear
**Bad:** "Invalid input"
**Good:** "Email must include @ symbol (example: user@domain.com)"

**Test:** Could someone fix it without calling support?

---

## 4. Image & Icon Accessibility

### All Images Need Alt Text
**Purpose:** Describe what's in the image for screen reader users who can't see it.

**Bad alt text:**
- Empty: `alt=""`
- Generic: `alt="image"` or `alt="photo"`
- Redundant: `alt="Red X button" <button>Close</button>` (button already says "Close")

**Good alt text:**
- Decorative image: `alt=""` (empty is correct here—no meaning)
- Reddit avatar: `alt="Avatar for u/username"` (describes purpose)
- Chart showing growth: `alt="User karma increased from 500 to 2,400 over 6 months"` (describes what chart shows)
- Icon with text: `alt=""` (text label already there, icon doesn't need alt)

**Rule:** Ask "If I describe this image to someone on the phone, what would I say?" That's your alt text.

### Icons Without Text Need Labels
**Bad:**
```html
<button>🗑</button> <!-- What does trash icon mean? Delete? Recycle? -->
```

**Good:**
```html
<button title="Delete interaction" aria-label="Delete interaction">🗑</button>
```

Screen reader reads: "Delete interaction, button"

---

## 5. Text & Readability

### Font Size Must Be Readable
**Minimum:** 16px for body text
**Headings:** At least 24px
**Captions:** 12px minimum, but prefer 14px

**Test:** Can you read it on mobile from arm's length? If not, too small.

### Line Height & Spacing Matter
**Line height:** 1.5x to 2x font size (e.g., 24px for 16px text)
**Letter spacing:** Normal is fine, don't compress
**Line length:** Max 70 characters per line (narrow columns are more readable)

**Why:** Reduces cognitive load, easier on dyslexic readers.

### Text Must Resize Properly
**Requirement:** Users can enlarge text to 200% without breaking layout

**Test:**
1. Go to browser settings
2. Zoom page to 200%
3. Can you still read everything?
4. Does content reflow or does it cut off?

**Common failures:** Fixed widths, horizontal overflow, text overlapping images

---

## 6. Audio & Video Accessibility

### Captions Required
**For:** Any video content
**Format:** Burned-in captions or VTT file
**Include:** All spoken dialogue + sound effects (e.g., [notification sound])
**Why:** Deaf viewers, noisy environments, non-native speakers

### Transcripts Required
**For:** Any audio content
**Format:** Searchable text document
**Include:** Speaker names, timestamps at least every 5 minutes
**Where:** Link next to audio player

### No Auto-Play
**Rule:** Never auto-play video or audio
**Why:** Unexpected sound startles users, interferes with screen readers, wastes bandwidth

---

## 7. Motion & Animation

### Respect Prefers-Reduced-Motion
**Requirement:** If user has set "reduce motion" OS setting, your animations should respect it

**How to implement:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Why:** Vestibular disorder users can get nauseous from motion.

### Animations Shouldn't Be Critical
**Bad:** Hover menu only appears on hover (invisible to keyboard users)
**Good:** Menu appears on focus too, works with keyboard

---

## 8. Readability for Neurodivergent Users

### Keep UI Simple
- **Don't:** Flashing text, strobing elements (can trigger seizures)
- **Don't:** Too many animations competing for attention
- **Do:** Consistent patterns, predictable layout

### Use Clear Language
- Avoid jargon when possible
- Break instructions into steps
- Use lists instead of paragraphs
- One main idea per heading

**For Reddinbox:** "Connect your Reddit account" not "Instantiate OAuth token acquisition for Reddit API v2 integration"

### Consistent Navigation
**Rule:** Navigation should be in same place on every page.

**Why:** Reduces cognitive load, helps users with memory issues.

---

## 9. Screen Reader Testing

### Test with a Real Screen Reader
**Options:**
- NVDA (free, Windows)
- JAWS (paid, Windows, most accurate)
- VoiceOver (built-in, Mac/iOS)
- TalkBack (built-in, Android)

**What to test:**
1. Can you reach all interactive elements?
2. Do buttons/links have descriptive labels?
3. Are form fields associated with labels?
4. Do alerts announce properly?
5. Can you understand page structure (headings hierarchy)?

**Spend 15 minutes:** Just listen to the page read aloud. You'll hear obvious issues immediately.

---

## 10. Mobile Accessibility

### Touch Targets Must Be Large
**Minimum:** 44x44 pixels (or 48x48 to be safe)
**Why:** Easier to tap accurately

**Bad:**
```html
<a href="#" style="padding: 4px;">Learn more</a> <!-- ~24px -->
```

**Good:**
```html
<a href="#" style="padding: 12px 16px;">Learn more</a> <!-- ~48px -->
```

### No Hover-Only Interactions
**Problem:** Mobile users can't hover.

**Bad:**
```html
<div>Price</div>
<div class="tooltip">Hover for details</div>
```

**Good:**
```html
<button>Price (show details)</button>
<!-- Or tap to reveal, not hover -->
```

### Viewport Configuration
**Must include:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Why:** Ensures page scales properly on mobile.

---

## Pre-Launch Checklist

### Automated Testing (2 minutes)
- [ ] Run [axe DevTools](https://www.deque.com/axe/devtools/) browser extension
- [ ] Fix all critical & serious issues
- [ ] Document minor issues for later

### Manual Testing (5 minutes)
- [ ] Navigate entire page with Tab key only
- [ ] Check all form fields have labels
- [ ] Verify error messages are clear
- [ ] Test with browser zoom at 200%
- [ ] Check mobile with touch targets

### Screen Reader Test (10 minutes)
- [ ] Turn on screen reader (VoiceOver on Mac is easiest)
- [ ] Navigate page from top to bottom
- [ ] Verify structure makes sense
- [ ] Check button/link labels are descriptive

### User Testing (If possible)
- [ ] Have someone with visual impairment test
- [ ] Have someone using keyboard only test
- [ ] Ask: "Was anything confusing or hard to use?"

---

## Resources

- **WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM:** https://webaim.org/
- **Accessibility Insights:** https://accessibilityinsights.io/
- **Color Contrast Checker:** https://webaim.org/resources/contrastchecker/

---

## For Reddinbox Specifically

**High Priority:**
- Form for Reddit account connection must be fully accessible
- Interaction queue (is this post relevant?) must be keyboard navigable
- Metrics/analytics must have alt text for any chart images
- Error messages (failed to connect, rate limited) must be clear

**Medium Priority:**
- Dashboard styling should be tested with colorblind simulation
- Notifications should have sound + visual indicators

**Nice to Have:**
- Provide keyboard shortcut legend for power users
- High contrast mode toggle for dashboard
