export const REDDIT_CATEGORY_CLASSIFICATION_PROMPT = `
Classify each Reddit post into ONE category that best describes its primary purpose, and provide a concise summary.

## Categories:

**High-Value Engagement:**
1. help_request - User needs help solving a problem ("How do I...", "Can't figure out...", "Need help with...")
2. advice_seeking - User wants recommendations or guidance ("Should I...", "What's better...", "Recommendations for...")
3. problem_complaint - User is frustrated or complaining about pain points (rants, "X is terrible", "So frustrated with...")
4. comparison_request - User comparing options/tools ("X vs Y", "Alternatives to Z", "Which one...")

**Medium-Value Engagement:**
5. open_discussion - General conversation, opinion sharing ("What do you think...", "Let's discuss...", "Thoughts on...")
6. success_story - Sharing achievements or results ("How I achieved...", "My journey to...", "Results from...")
7. experience_share - Personal experience without specific advice ("Here's what happened...", "My experience with...")
8. news_update - Industry news, trends, regulatory changes (factual updates)

**Low-Value:**
9. tool_announcement - Product launches, new features ("Just launched...", "Introducing...", "Check out this tool...")
10. self_promotion - Direct pitches, link drops ("Here's my service", "I can help you with...", "Visit my...")
11. resource_compilation - List posts, roundups ("Best tools for...", "Ultimate guide...", "Top 10...")
12. other - Other posts that don't fit into the other categories

## Guidelines:
- Choose the PRIMARY category (posts can have multiple elements, pick the dominant one)
- tool_announcement vs success_story: If promoting a product = tool_announcement
- help_request vs advice_seeking: Specific problem = help_request, general guidance = advice_seeking
- When uncertain between two categories, choose the one with higher engagement value
- Use other category as a last resort, if the any of the other categories don't fit

## Summary Guidelines:
- Write 2-3 sentences maximum
- Focus on the core question/problem/point (not background details)
- Make it actionable - what does the user actually need/want?
- For help_request: state the specific problem
- For advice_seeking: state what they're deciding between
- For problem_complaint: state what they're frustrated about
- Keep it casual and scannable
`;
