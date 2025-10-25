# Reddinbox Playbook Improver

When improving a playbook MDX file, follow this process:

## 1. Analyze & Generate Metadata

Extract from the playbook content:

**Title** (60 chars max, action-focused)

- Format: "How to [Achieve X] Through [Method Y]"
- Examples: "How to Generate Qualified Leads Through Reddit Value-Giving"

**Description** (120-160 chars, benefit-focused)

- Include WHO + WHAT + WHY
- Example: "Learn how genuine community engagement on Reddit turns into qualified leads without spam tactics."

**Image**: `/playbooks/[kebab-case-title].jpg`

**Date**: Today's date in "YYYY-MM-DD" format

Output as MDX frontmatter:

```
---
title: ""
description: ""
image: "/playbooks/xxx.jpg"
date: "2025-10-24"
---
```

## 2. Rewrite Using Storytelling

Follow this structure:

**Hook Opening** (1-2 paragraphs)

- Start with relatable problem
- Make reader feel seen
- Example: "Most businesses try [wrong approach] and wonder why it fails..."

**The Real Story** (Main body)

- Show actual Reddit post/comment (block quote)
- Explain WHY it was high-value
- Show our actual reply (block quote)
- Explain the strategy behind each part
- Show the conversation (what happened next)

**Why It Worked** (Analysis)

- Break down 3-5 key principles
- Format: **[Principle]: [Explanation]**
- Be specific, not generic

**How To Replicate** (Actionable lessons)

- Give 3-5 things readers can do themselves
- Format: **[Action]: [How to do it]**

**Soft Closing** (Circle back to Reddinbox)

- Frame as: "imagine if this happened across all your subreddits"
- Mention Reddinbox as the scaling tool, not the main message

## 3. Tone & Voice

✅ Do:

- Be specific (names, dates, actual quotes)
- Use conversational language
- Show the messy reality
- Write like teaching a friend
- Explain the WHY behind tactics
- Use link to homepage when mentioning [Reddinbox](/)

❌ Don't:

- Sound corporate or salesy
- Over-explain Reddinbox features
- Hide strategy in jargon
- Make it sound easy
- Hard sell the product

## 4. Quality Check

Before finishing, verify:

- [ ] Real Reddit interaction (actual URLs, usernames, quotes)
- [ ] Educational (reader learns something applicable)
- [ ] Story flows (problem → response → outcome → lessons)
- [ ] Authentic tone (casual, conversational, honest)
- [ ] Specific examples (not generic advice)
- [ ] Replicable (someone could do this without your tool)
- [ ] Soft sell (Reddinbox mentioned as the scale lever)
- [ ] Proof included (Reddit link)
- [ ] Compelling (would you share this?)

## 5. Output

Return the complete, production-ready MDX file with:

- Updated metadata at the top
- Rewritten content with storytelling
- Proper markdown formatting
- Ready to publish

## Extra Notes

- You must make each playbook more interactive, for that, start analyzing @BlogStylings.tsx to see the options of components you have available.
- Never use em dash (—) on the content, use commas instead.
- When there're text as [text], it means they're variables or content you need to re-write
- NEVER modify Reddit content such as posts, comments or messages
