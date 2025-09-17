import { LeadScoringRequest } from "../defs/ai/lead-scoring";

export const buildMessageForLeadScoring = (
  scoringRequest: LeadScoringRequest
) => {
  return JSON.stringify(`
    **WEBSITE TO ANALYZE FOR:**
    - Name: ${scoringRequest.websiteName}
    - Description: ${scoringRequest.websiteDescription}

    **REDDIT CONTENT TO SCORE:**

    ${scoringRequest.redditContent
      .map(
        (item, index) => `
          <item-${index + 1}>
            reddit_id: ${item.reddit_id}
            type: ${item.content_type}
            subreddit: r/${item.subreddit}
            content: ${item.content}
          </item-${index + 1}>`
      )
      .join("\n")}
  `);
};
