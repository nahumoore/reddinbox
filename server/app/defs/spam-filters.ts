interface RedditPost {
  data: {
    id: string;
    title: string;
    selftext: string;
    author: string;
    subreddit: string;
    created_utc: number;
    url: string;
    permalink: string;
    ups: number;
    downs: number;
    crosspost_parent_list?: {
      selftext: string;
    }[];
  };
}

interface SpamFilterResult {
  isSpam: boolean;
  reasons: string[];
}

interface SpamFilterConfig {
  maxLinks: number;
  maxCapPercentage: number;
  maxPostLength: number;
  minEngagementScore: number;
}

// DEFAULT SPAM FILTER CONFIGURATION
const DEFAULT_CONFIG: SpamFilterConfig = {
  maxLinks: 1, // ALLOW ONLY 1 LINK (FLAG 2+)
  maxCapPercentage: 30, // FLAG IF MORE THAN 30% IS CAPS
  maxPostLength: 5000, // FLAG POSTS LONGER THAN 5000 CHARACTERS
  minEngagementScore: -5, // FLAG POSTS WITH SCORE BELOW -5
};

// COMPREHENSIVE LIST OF SHORTENED URL DOMAINS
const SHORTENED_URL_DOMAINS = [
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'adf.ly',
  'bl.ink',
  'clicky.me',
  'db.tt',
  'fiverr.com/s2',
  'git.io',
  'handl.it',
  'href.li',
  'lnkd.in',
  'mcaf.ee',
  'ow.ly',
  'po.st',
  'shar.es',
  'soo.gd',
  'tiny.cc',
  'tny.im',
  'tr.im',
  'twurl.nl',
  'u.to',
  'v.gd',
  'wp.me',
  'x.co',
  'youtu.be',
  'short.link',
  'cutt.ly',
  'rebrand.ly',
  'clickmeter.com',
  'smarturl.it',
  'linktr.ee',
  'bio.link',
  'linkin.bio',
  'page.link',
  'firebase.app',
  'forms.gle',
  'meet.google.com',
  'zoom.us',
  'tiktok.com/@',
  'instagram.com/p/',
  'fb.me',
  'amzn.to',
  'ebay.to',
  'aliexpress.com/item',
  'discord.gg',
  'reddit.com/r/',
];

// COMMON ACRONYMS AND ABBREVIATIONS TO IGNORE IN CAPS DETECTION
const CAPS_EXCEPTIONS = [
  'AI', 'API', 'UI', 'UX', 'CEO', 'CTO', 'USA', 'UK', 'NYC', 'LA', 'SF',
  'HTML', 'CSS', 'JS', 'SQL', 'AWS', 'GPU', 'CPU', 'RAM', 'SSD', 'HDD',
  'HTTP', 'HTTPS', 'URL', 'DNS', 'VPN', 'SSL', 'TLS', 'PDF', 'PNG', 'JPG',
  'GIF', 'MP4', 'FAQ', 'DIY', 'AMA', 'TIL', 'ELI5', 'TLDR', 'NSFW', 'SFW',
  'OP', 'PM', 'DM', 'ASAP', 'FYI', 'BTW', 'IMO', 'IMHO', 'LOL', 'LMAO',
];

/**
 * MAIN SPAM FILTER FUNCTION - ANALYZES POST FOR SPAM INDICATORS
 */
export function isSpamPost(post: RedditPost, config: SpamFilterConfig = DEFAULT_CONFIG): SpamFilterResult {
  const reasons: string[] = [];
  
  // COMBINE TITLE AND CONTENT FOR ANALYSIS
  const fullContent = `${post.data.title}\n\n${
    post.data.selftext ||
    (post.data.crosspost_parent_list &&
    post.data.crosspost_parent_list.length > 0
      ? post.data.crosspost_parent_list[0].selftext
      : "")
  }`.trim();

  // SKIP EMPTY POSTS
  if (!fullContent || fullContent.length < 10) {
    return { isSpam: false, reasons: [] };
  }

  // CHECK FOR MODERATOR REMOVED CONTENT
  if (checkModeratorRemoved(fullContent)) {
    reasons.push('moderator_removed');
  }

  // CHECK FOR MULTIPLE LINKS
  const linkCount = countLinks(fullContent);
  if (linkCount > config.maxLinks) {
    reasons.push(`multiple_links:${linkCount}`);
  }

  // CHECK FOR SHORTENED URLS
  if (hasShortenedUrls(fullContent)) {
    reasons.push('shortened_urls');
  }

  // CHECK FOR EXCESSIVE CAPS
  const capsPercentage = calculateCapsPercentage(fullContent);
  if (capsPercentage > config.maxCapPercentage) {
    reasons.push(`excessive_caps:${Math.round(capsPercentage)}%`);
  }

  // CHECK FOR OVERLY LONG POSTS
  if (fullContent.length > config.maxPostLength) {
    reasons.push(`long_post:${fullContent.length}chars`);
  }

  // CHECK FOR HEAVILY DOWNVOTED CONTENT
  const engagementScore = (post.data.ups || 0) - (post.data.downs || 0);
  if (engagementScore < config.minEngagementScore) {
    reasons.push(`low_engagement:${engagementScore}`);
  }

  return {
    isSpam: reasons.length > 0,
    reasons
  };
}

/**
 * CHECK IF CONTENT HAS BEEN REMOVED BY MODERATORS
 */
function checkModeratorRemoved(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return (
    lowerContent.includes('[removed]') ||
    lowerContent.includes('[deleted]') ||
    lowerContent === '[removed]' ||
    lowerContent === '[deleted]'
  );
}

/**
 * COUNT TOTAL NUMBER OF LINKS IN CONTENT
 */
function countLinks(content: string): number {
  // REGEX TO MATCH HTTP/HTTPS URLS
  const urlRegex = /https?:\/\/[^\s\)]+/gi;
  const matches = content.match(urlRegex);
  return matches ? matches.length : 0;
}

/**
 * CHECK IF CONTENT CONTAINS SHORTENED URLS
 */
function hasShortenedUrls(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return SHORTENED_URL_DOMAINS.some(domain => {
    // CHECK FOR DOMAIN WITH PROTOCOL
    return lowerContent.includes(`://${domain}`) || 
           lowerContent.includes(`www.${domain}`) ||
           // CHECK FOR DOMAIN WITHOUT PROTOCOL (COMMON IN SPAM)
           lowerContent.includes(domain);
  });
}

/**
 * CALCULATE PERCENTAGE OF CAPS IN CONTENT (IGNORING COMMON ACRONYMS)
 */
function calculateCapsPercentage(content: string): number {
  // REMOVE URLS FROM ANALYSIS TO AVOID FALSE POSITIVES
  const contentWithoutUrls = content.replace(/https?:\/\/[^\s]+/gi, '');
  
  // GET ALL WORDS
  const words = contentWithoutUrls.match(/\b[A-Za-z]+\b/g);
  if (!words || words.length === 0) return 0;

  // FILTER OUT COMMON ACRONYMS AND COUNT CAPS WORDS
  const nonAcronymWords = words.filter(word => !CAPS_EXCEPTIONS.includes(word.toUpperCase()));
  const capsWords = nonAcronymWords.filter(word => {
    // CONSIDER WORD AS CAPS IF IT'S ALL UPPERCASE AND HAS MORE THAN 2 CHARACTERS
    return word === word.toUpperCase() && word.length > 2;
  });

  // CALCULATE PERCENTAGE BASED ON NON-ACRONYM WORDS
  return nonAcronymWords.length > 0 ? (capsWords.length / nonAcronymWords.length) * 100 : 0;
}

/**
 * BATCH FILTER POSTS - RETURNS ONLY NON-SPAM POSTS
 */
export function filterSpamPosts(posts: RedditPost[], config?: SpamFilterConfig): {
  validPosts: RedditPost[];
  spamStats: {
    totalProcessed: number;
    spamFiltered: number;
    reasonCounts: Record<string, number>;
  };
} {
  const validPosts: RedditPost[] = [];
  const reasonCounts: Record<string, number> = {};
  let spamFiltered = 0;

  for (const post of posts) {
    const filterResult = isSpamPost(post, config);
    
    if (filterResult.isSpam) {
      spamFiltered++;
      // COUNT EACH SPAM REASON
      filterResult.reasons.forEach(reason => {
        const baseReason = reason.split(':')[0]; // GET BASE REASON WITHOUT DETAILS
        reasonCounts[baseReason] = (reasonCounts[baseReason] || 0) + 1;
      });
    } else {
      validPosts.push(post);
    }
  }

  return {
    validPosts,
    spamStats: {
      totalProcessed: posts.length,
      spamFiltered,
      reasonCounts
    }
  };
}

/**
 * HELPER FUNCTION TO LOG SPAM FILTERING STATISTICS
 */
export function logSpamStats(stats: { totalProcessed: number; spamFiltered: number; reasonCounts: Record<string, number> }): void {
  if (stats.spamFiltered === 0) {
    console.log(`✅ Spam filter: ${stats.totalProcessed} posts processed, no spam detected`);
    return;
  }

  const filterRate = ((stats.spamFiltered / stats.totalProcessed) * 100).toFixed(1);
  console.log(`🛡️  Spam filter: ${stats.spamFiltered}/${stats.totalProcessed} posts filtered (${filterRate}%)`);
  
  // LOG BREAKDOWN BY REASON
  const sortedReasons = Object.entries(stats.reasonCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5); // SHOW TOP 5 REASONS
    
  if (sortedReasons.length > 0) {
    console.log(`📊 Top spam reasons: ${sortedReasons.map(([reason, count]) => `${reason}(${count})`).join(', ')}`);
  }
}