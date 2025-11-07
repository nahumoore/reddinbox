import { Interaction } from "./get-todays-posted-interactions";

interface ThreadComment {
  id: string;
  date: string;
  author: string;
  content: string;
  replies: ThreadComment[];
}

export type LeadPerWebsite = {
  website_id: string;
  website_name: string;
  website_keywords: string[];
  website_description: string;
  website_target_audience: string;
  user_id: string;
  leads: {
    reddit_username: string;
    lead_score: number | null;
    conversation_summary: string | null;
    buying_signals: string | null;
    pain_points: string | null;
    interactions: {
      original_post: {
        id: string;
        title: string;
        author: string;
        content: string;
      };
      comments: ThreadComment[];
    }[];
  }[];
};

export const groupLeadsPerWebsite = ({
  interactions,
}: {
  interactions: Interaction[];
}): LeadPerWebsite[] => {
  // GROUP INTERACTIONS BY WEBSITE_ID AND USER_ID AND REDDIT_USERNAME
  const groupedByWebsite = new Map<string, LeadPerWebsite>();
  const leadInteractionsMap = new Map<string, Interaction[]>();

  for (const interaction of interactions) {
    // CREATE UNIQUE KEY FOR WEBSITE + USER COMBINATION
    const websiteKey = `${interaction.website_id}_${interaction.user_id}`;

    // CREATE UNIQUE KEY FOR LEAD (WEBSITE + USER + REDDIT_USERNAME)
    const leadKey = `${websiteKey}_${interaction.interacted_with_reddit_username}`;

    // GET OR CREATE WEBSITE GROUP
    if (!groupedByWebsite.has(websiteKey)) {
      groupedByWebsite.set(websiteKey, {
        website_id: interaction.website_id,
        website_name: interaction.websites.name,
        website_keywords: interaction.websites.keywords,
        website_description: interaction.websites.description,
        website_target_audience: interaction.websites.target_audience,
        user_id: interaction.user_id,
        leads: [],
      });
    }

    const websiteGroup = groupedByWebsite.get(websiteKey)!;

    // FIND OR CREATE LEAD FOR THIS REDDIT USERNAME
    let lead = websiteGroup.leads.find(
      (l) => l.reddit_username === interaction.interacted_with_reddit_username
    );

    if (!lead) {
      lead = {
        reddit_username: interaction.interacted_with_reddit_username,
        lead_score: null,
        conversation_summary: null,
        buying_signals: null,
        pain_points: null,
        interactions: [],
      };
      websiteGroup.leads.push(lead);
    }

    // COLLECT RAW INTERACTIONS FOR THIS LEAD
    if (!leadInteractionsMap.has(leadKey)) {
      leadInteractionsMap.set(leadKey, []);
    }
    leadInteractionsMap.get(leadKey)!.push(interaction);
  }

  // TRANSFORM COLLECTED INTERACTIONS USING buildContextThread
  for (const websiteGroup of groupedByWebsite.values()) {
    for (const lead of websiteGroup.leads) {
      const leadKey = `${websiteGroup.website_id}_${websiteGroup.user_id}_${lead.reddit_username}`;
      const rawInteractions = leadInteractionsMap.get(leadKey) || [];

      // BUILD CONTEXT THREAD FOR THIS LEAD'S INTERACTIONS
      lead.interactions = buildContextThread({ interactions: rawInteractions });
    }
  }

  // CONVERT MAP TO ARRAY AND RETURN
  return Array.from(groupedByWebsite.values());
};

const buildContextThread = ({
  interactions,
}: {
  interactions: Interaction[];
}): LeadPerWebsite["leads"][number]["interactions"] => {
  // TRANSFORM EACH INTERACTION INTO THE PROPER STRUCTURE
  return interactions.map((interaction) => {
    // IF COMMENT_REPLY, RETURN THREAD_CONTEXT AS IS
    if (interaction.interaction_type === "comment_reply") {
      return interaction.thread_context as unknown as LeadPerWebsite["leads"][number]["interactions"][number];
    }

    // BUILD ORIGINAL POST OBJECT FROM REDDIT_CONTENT_DISCOVERED
    const original_post = {
      id: interaction.reddit_content_discovered.id,
      title: interaction.reddit_content_discovered.title,
      author: interaction.reddit_content_discovered.author,
      content: interaction.reddit_content_discovered.content,
    };

    const comments = [
      {
        id: interaction.id,
        date: interaction.created_at,
        author: "YOU",
        content: interaction.our_interaction_content,
        replies: [],
      },
    ];

    return {
      original_post,
      comments,
    };
  });
};
