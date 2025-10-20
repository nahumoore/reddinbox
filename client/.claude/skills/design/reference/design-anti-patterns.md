# Design Anti-Patterns to Avoid

These are common UI/UX mistakes that frustrate users, harm trust, or reduce conversions. Avoid them.

---

## 1. Auto-Playing Media

**The Problem:** Video or audio starts automatically without user action.

**Why users hate it:**
- Unexpected sound startles
- Wastes bandwidth
- Drowns out other audio (podcasts, music, calls)
- Accessibility nightmare for screen reader users

**Where it happens:** Hero videos on landing pages, embedded videos, background music

**The Fix:**
- Play button only, no auto-play
- If animation is necessary, make it a silent looping video
- Always provide controls (play, pause, mute)

**Example:** 
- ❌ Page loads → video auto-plays with sound
- ✅ Page loads → video visible with play button → user clicks to play

---

## 2. Surprising Navigation

**The Problem:** Navigation moves, hides, or changes unexpectedly.

**Specific issues:**

### Menu Disappears When You Click It
```html
<!-- BAD: Menu closes immediately -->
<button onclick="toggleMenu(); closeAfterDelay();">Menu</button>
```
User clicks → menu opens → menu closes → user confused

**Fix:** Keep menu open until user clicks elsewhere or closes it explicitly.

### Sticky Header Covers Content
User clicks link → page jumps → fixed header covers content anyway

**Fix:** Adjust scroll position so content is visible below header.

### "Back" Button Doesn't Go Back
User clicks → surprised at different page (wasn't where they expected)

**Rule:** Browser back button should work predictably. If you're using hash-based navigation, implement history.pushState() correctly.

---

## 3. Disabled Buttons Without Explanation

**The Problem:** Button is grayed out with no indication why.

**User experience:**
- ❌ Button is grayed out
- User: "Why can't I click this? What am I missing?"
- Wasted time trying to figure it out

**The Fix:** Always provide context.

**Good examples:**
- "Connect your Reddit account first" (hover tooltip or inline text)
- "Email is required to save" (clear requirement)
- "Plan limits reached (upgrade to continue)" (shows what needs to happen)

**Implementation:**
```html
<!-- Good: Shows reason on hover -->
<button disabled title="Fill in all fields to continue">Save</button>

<!-- Better: Always visible explanation -->
<button disabled>Save</button>
<p style="color: #6B7280; font-size: 14px;">Complete all fields to save</p>
```

---

## 4. Forms That Reset After Validation Errors

**The Problem:** User fills form → makes one mistake → submits → entire form clears

**User experience:**
- Fill 10 fields
- Make typo in email
- Submit
- Everything disappears
- Rage quit

**The Fix:**
- Keep all values user entered
- Show error on specific field (not whole page)
- Highlight what needs fixing
- User corrects → can re-submit

**For Reddinbox example:**
- ❌ User enters Reddit username, password, OAuth scope preferences → makes typo in password → submits → everything clears
- ✅ User fills form → makes typo in password → shows "Invalid password format" → corrects password → resubmits with all other data intact

---

## 5. Too Many Colors Fighting for Attention

**The Problem:** Every important thing is a different bright color. Nothing stands out.

**Visual hierarchy breaks:**
- Red button for secondary action (should be green for primary)
- 5 different shades of blue competing
- Neon colors everywhere
- No clear "most important" element

**The Fix:** Design with a priority system.

**Example for Reddinbox dashboard:**
- 🟢 Green for actions user should take ("Connect account", "Review this interaction")
- 🔵 Blue for information ("View analytics", "More details")
- ⚪ Gray for secondary ("Cancel", "Back")
- 🔴 Red for destructive ("Delete", "Disconnect")

**Rule:** Your color palette should have no more than 5 primary colors, used consistently for specific meanings.

---

## 6. Hover-Only Actions (Mobile Users Can't Hover)

**The Problem:** Information or controls only appear on hover. Mobile users can't access them.

**Examples:**
- Trash icon appears on hover (mobile can't see it)
- Dropdown menu opens on hover (mobile taps close it)
- Edit button appears on hover (mobile: "Where's the button?")

**The Fix:**
- Show controls always, or
- Show controls on focus/tap, or
- Use a menu button (three dots) that always visible

**For Reddinbox interactions:**
- ❌ Interaction card → hover to see "Respond" and "Skip" buttons
- ✅ Interaction card → "Respond" and "Skip" buttons always visible, or tap card to reveal

---

## 7. Infinite Scroll Without "Back to Top"

**The Problem:** User scrolls through interactions → scrolls for 5 minutes → wants to see header → must scroll back up for 5 minutes

**User experience:**
- Endless scrolling feels good at first
- Then it's annoying when user wants to go back
- No way to quickly get to top

**The Fix:**
- Provide floating "Back to Top" button (appears at 3-4 screens down)
- Or provide pagination
- Or combination: infinite scroll + back to top button

**For Reddinbox:** If using infinite scroll for interaction queue, add floating button that appears after ~20 items.

---

## 8. Outdated Loading States

**The Problem:** Spinning circle with no context.

**User questions:**
- "Is it actually loading?"
- "How much longer?"
- "Is it frozen?"

**The Fix:** Give context and progress.

**Bad:**
```html
<div class="spinner"></div> <!-- That's it -->
```

**Good:**
```html
<div class="spinner"></div>
<p>Analyzing your Reddit profile...</p>
```

**Better:**
```html
<div class="progress-bar" style="width: 40%;"></div>
<p>Analyzed 4 of 10 posts...</p>
```

**Best:**
```html
<div class="skeleton-card"></div>
<div class="skeleton-card"></div>
<!-- Skeleton loading shows shape of what's coming -->
```

---

## 9. No Visual Feedback After Action

**The Problem:** User clicks → nothing happens (or isn't clear something happened)

**Examples:**
- Click "Save" → button stays the same → did it work?
- Submit form → no confirmation → is it processing?
- Click "Connect" → no feedback → is it loading?

**User experience:** Uncertainty → user clicks again → duplicate request → frustration

**The Fix:** Show immediate, clear feedback.

**Good feedback sequence:**
1. Button changes to "Loading..." or shows spinner
2. Action completes
3. Show success message ("Profile connected") OR change state visually
4. Auto-dismiss success message after 3-4 seconds (user knows it worked)

**Example:**
```
Before: "Connect account" button
Click ↓
After: "Connecting..." (spinner)
Success ↓
After: "✓ Account connected" (green, 3 seconds)
Final: Button text changes to "Disconnect"
```

---

## 10. Unclear Error Messages

**The Problem:** Error message doesn't explain what's wrong or how to fix it.

**Bad errors:**
- "Error" (what error?)
- "Invalid input" (what's invalid about it?)
- "Request failed" (why did it fail?)
- "404" (what does that mean?)

**Good errors:**
- "Username must be 3-20 characters (you entered 2)"
- "Password must include uppercase letter, number, and symbol"
- "Rate limited: You can retry in 2 minutes"
- "Failed to connect: Check your Reddit credentials and try again"

**Rule:** Every error message should answer:
1. What went wrong?
2. Why did it go wrong?
3. How can user fix it?

**For Reddinbox:**
- ❌ "Connection failed"
- ✅ "Failed to connect: Reddit account 'username' already linked to another Reddinbox account. Disconnect first to re-link."

---

## 11. Forms That Don't Validate Until Submit

**The Problem:** User fills 10-field form → submits → gets 5 errors all at once

**Better approach:** Validate as they go.

**Progressive validation:**
- Field loses focus → validate that field
- Show error immediately below field
- Change input border to red
- User fixes → error disappears
- User can't submit with errors (button disabled with explanation)

**Benefits:**
- User fixes mistakes immediately (don't wait until submit)
- Fewer validation errors at submit (most already fixed)
- Users feel like the form is "helping" them

---

## 12. Missing Empty States

**The Problem:** User sees blank page. No explanation.

**User confusion:**
- "Is it loading?"
- "Is it broken?"
- "What am I supposed to do?"

**The Fix:** Design every empty state.

**Good empty state includes:**
1. **Illustration** (optional but helps): Empty inbox icon
2. **Headline**: "No interactions yet"
3. **Explanation**: "You haven't identified any relevant Reddit discussions yet"
4. **Action**: "Connect your account to get started" (with button)

**For Reddinbox:**
- ❌ Dashboard shows nothing → user: "Is this working?"
- ✅ Dashboard shows: Empty state illustration + "Your Reddit profile is connected! Once you identify interactions, they'll appear here. Browse r/[subreddit] to find relevant posts."

---

## 13. Text That's Hard to Read (Bad Contrast or Formatting)

**The Problem:** Text is too small, colors don't contrast, or formatting is chaotic.

**Issues:**
- Light gray text on white background (can't read)
- Yellow text on white (can't read)
- Entire paragraph in one font/size (hard to scan)
- Line too wide (lose your place reading)

**The Fix:**
- Use WCAG AA contrast (4.5:1 minimum for text)
- Use consistent, readable fonts
- Use headings to break up content
- Max 70 characters per line
- Adequate line spacing (1.5x font size minimum)

---

## 14. Outdated or Ambiguous Language

**The Problem:** User doesn't understand what button does.

**Bad buttons:**
- "Submit" (submit what?)
- "OK" (OK for what?)
- "Process" (process what?)
- "Confirm" (confirm what?)

**Good buttons:**
- "Connect Reddit Account"
- "Review Next Interaction"
- "Save Settings"
- "Delete Interaction"

**Rule:** Action should be clear from button text alone. User shouldn't have to read surrounding text to understand button.

**For Reddinbox:**
- ❌ "Send" button in interaction modal (send what? Reply? Skip?)
- ✅ "Send Reply" and "Skip to Next" (clear intent)

---

## 15. Unresponsive Design (Doesn't Work on Mobile)

**The Problem:** Website works on desktop but breaks on mobile.

**Common failures:**
- Text too small to read on mobile
- Buttons too small to tap (less than 44x44px)
- Layout breaks (horizontal scrolling, overlapping elements)
- Hover-only menus don't work (mobile can't hover)
- Navigation hamburger menu doesn't work properly

**The Fix:** Test on real mobile devices, not just browser zoom.

**Mobile checklist:**
- [ ] Can read all text without zooming
- [ ] All buttons are at least 44x44px
- [ ] Layout adapts (doesn't scroll horizontally)
- [ ] Hamburger menu works and closes properly
- [ ] Forms are easy to fill with mobile keyboard
- [ ] Performance is acceptable (pages load in <3 seconds)

---

## 16. Asking for Permission/Data Too Early

**The Problem:** User visits page → immediately asked for email, phone, credit card, or complex preferences

**User reaction:** "I don't know you yet, why should I trust you?"

**The Fix:** Build trust first, ask later.

**Progressive disclosure:**
1. Let user explore / see value
2. When they're engaged, ask for email
3. When they're hooked, ask for payment

**For Reddinbox example:**
- ❌ Landing page → "Create account with Reddit OAuth" → immediate setup quiz
- ✅ Landing page → "See how it works" demo → "Try it free" → redirects to signup with context

---

## 17. Multiple Calls-to-Action Competing

**The Problem:** Page has 5 different "sign up" / "buy" buttons in different colors and sizes.

**User confusion:** Where should I click?

**The Fix:** One primary call-to-action.

**Hierarchy:**
- Primary action: Largest, brightest color, top of page
- Secondary actions: Smaller, muted color
- Tertiary actions: Links, minimal styling

**For Reddinbox:**
- ❌ Page has "Connect with Reddit" (blue), "Start Free Trial" (green), "Upgrade Now" (red) all competing
- ✅ Page highlights "Connect with Reddit" (primary action), "Upgrade" as smaller secondary option

---

## 18. Breaking Browser Conventions

**The Problem:** Doing things opposite to how browsers normally work.

**Examples:**
- Right-click menu doesn't show "Back" or "Reload"
- Links aren't blue or underlined (user doesn't know they're links)
- Back button doesn't actually go back
- Text can't be selected (locked with CSS)

**The Fix:** Follow browser conventions unless you have a very good reason not to.

**Rule:** Users have expectations from browsing thousands of websites. Meet those expectations.

---

## Anti-Pattern Checklist

Before design review, verify you're NOT doing these:

- [ ] Auto-playing any media
- [ ] Surprising navigation changes
- [ ] Disabled buttons without explanation
- [ ] Forms that reset after errors
- [ ] Too many competing colors
- [ ] Hover-only actions (on mobile-used features)
- [ ] Infinite scroll without "back to top"
- [ ] Unclear loading states
- [ ] No feedback after action
- [ ] Vague error messages
- [ ] Form validation only at submit
- [ ] Missing empty states
- [ ] Unreadable text (contrast, size, line length)
- [ ] Outdated button language
- [ ] Mobile responsiveness issues
- [ ] Asking for info too early
- [ ] Multiple competing CTAs
- [ ] Breaking browser conventions

**If you checked any boxes, redesign that section.**
