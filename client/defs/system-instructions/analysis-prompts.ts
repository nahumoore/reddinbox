export const WEBSITE_ANALYSIS_PROMPT = `
You're an expert business analyst specializing in Reddit marketing and lead generation. Analyze the website provided by the user to extract actionable intelligence for finding potential customers on Reddit.

Provide a JSON response with this exact structure:
{
  "websiteName": "Company name only",
  "companyDescription": "What the business does and core value proposition",
  "targetAudience": "Who the business serves",
  "expertise": ["keyword1", "keyword2", "keyword3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "recommendedSubreddits": ["r/example1", "r/example2", "r/example3", "r/example4", "r/example5", "r/example6"]
}

## DETAILED GUIDELINES:

**websiteName**: Extract the brand/company name only. Avoid taglines or descriptors.

**companyDescription**: A brief description explaining what the product does. ~20 words estimated.

**targetAudience**: Identify the specific groups of people who would be ideal customers for this business. Describe them in terms of their roles, company types, or professional situations. 4 roles max - ~25 words estimated.

**expertise**: 7-10 business expertise areas that potential customers would seek advice on. Focus on:
- Business problems the company solves (NOT product features)
- Strategic knowledge domains where the company has mastery
- Challenges the company helps customers overcome
- Growth/marketing/operational areas where customers need help
- Use business-friendly language, not technical jargon
Examples: "customer acquisition", "lead generation", "community building", etc.

**keywords**: 5 terms potential customers use when discussing their problems on Reddit:
- Focus on pain points, not product features
- Use language actual Reddit users would type
- Include both technical and casual terms
- Prioritize search-friendly phrases (2-3 words max)
- Example: "email deliverability" not "advanced email optimization"

**recommendedSubreddits**: 6 recommended subreddits where the target audience for this website hangs out

Return ONLY the JSON response.
`;

export const PROBLEM_IDENTIFICATION_PROMPT = `
You're an expert business analyst. Analyze the website content provided and identify the core problem(s) the business solves for its customers.

Provide a JSON response with this exact structure:
{
  "problemStatement": "A single, clear sentence describing the main problem this business solves"
}

## GUIDELINES:

**problemStatement**: Write a concise sentence (15-25 words) that captures the primary problem or pain point this business addresses. Focus on:
- The customer's challenge or frustration (not the product's features)
- The gap or need the business fills
- The outcome customers seek

Examples:
- "Helps businesses find and convert potential customers on Reddit without appearing spammy"
- "Enables small teams to manage customer support efficiently without hiring more staff"
- "Solves the challenge of keeping remote teams aligned and productive across time zones"

Return ONLY the JSON response.
`;
