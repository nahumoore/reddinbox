export const redditLeadClassificationPrompt = ({
  productName,
  productDescription,
  productKeywords,
  productTargetAudience,
}: {
  productName: string;
  productDescription: string;
  productKeywords: string[];
  productTargetAudience: string;
}) => {
  const first3Keywords = productKeywords.slice(0, 3).join(", ");

  return `
You are a Reddit lead scoring and classification expert analyzing potential customers for ${productName} - ${productDescription}.

This product targets ${productTargetAudience}.

Your task is to analyze Reddit conversations to identify high-quality leads based on their interactions with our team.

**IMPORTANT:**
- You will receive an ARRAY of leads to analyze
- Each lead has a 'reddit_username' field that you MUST include in your response to identify them
- Whenever you see an author as 'YOU', it means that it's a comment from ${productName} - this is just for context
- Your job is to analyze each lead's interactions and return classification results for ALL of them

## LEAD SCORING CRITERIA (0-100):

**High Score (70-100):**
- Explicitly mentioned a problem that ${productName} solves
- Asked specific questions about solutions in our domain (${first3Keywords})
- Showed urgency or timeline for solving their problem
- Engaged multiple times in meaningful conversation
- Has authority/decision-making power (business owner, manager, founder)

**Medium Score (40-69):**
- Discussed relevant pain points but no explicit interest
- General questions about the industry/topic
- Single meaningful interaction
- Appears to be researching solutions

**Low Score (0-39):**
- Minimal engagement or generic responses
- Off-topic discussions
- No clear pain points identified
- Likely just casual browsing

## BUYING SIGNALS TO IDENTIFY:
- Budget mentions or willingness to pay
- Timeline urgency ("need this soon", "looking for X now")
- Authority indicators ("I run/manage/own", "we're looking for")
- Specific feature/solution requests
- Frustration with current tools/methods
- Direct questions about pricing/implementation

## PAIN POINTS TO EXTRACT:
- Current problems they're facing
- Tools/methods that are failing them
- Inefficiencies or bottlenecks mentioned
- Desired outcomes they can't achieve
- Complaints about existing solutions

## CONVERSATION SUMMARY:
Write a 2-3 sentence summary covering:
1. Who they are and what they're trying to accomplish
2. Their main pain point or challenge
3. How engaged they've been in the conversation

Be objective and honest in your scoring. Not every Reddit user is a good lead.
`;
};

export const redditLeadClassificationSchema = {
  name: "lead_classification",
  strict: true,
  schema: {
    type: "object",
    properties: {
      leads: {
        type: "array",
        description: "Array of classified leads",
        items: {
          type: "object",
          properties: {
            reddit_username: {
              type: "string",
              description: "The Reddit username to identify this lead",
              minLength: 1,
            },
            lead_score: {
              type: "number",
              description: "Lead score (0-100)",
              minimum: 0,
              maximum: 100,
            },
            conversation_summary: {
              type: "string",
              description: "The summary between the interactions",
              minLength: 1,
            },
            buying_signals: {
              type: "array",
              description: "The buying signals extracted from the interactions",
              items: {
                type: "string",
                minLength: 1,
              },
              minItems: 1,
              maxItems: 5,
            },
            pain_points: {
              type: "array",
              description: "The pain points extracted from the interactions",
              items: {
                type: "string",
                minLength: 1,
              },
              minItems: 1,
              maxItems: 5,
            },
          },
          required: [
            "reddit_username",
            "lead_score",
            "conversation_summary",
            "buying_signals",
            "pain_points",
          ],
          additionalProperties: false,
        },
        minItems: 1,
      },
    },
    required: ["leads"],
    additionalProperties: false,
  },
};
