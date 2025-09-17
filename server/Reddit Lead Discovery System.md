# 🚀 Reddit Lead Discovery System - Architecture Plan

## 🏗️ System Overview

**Multi-tenant system** where each user configures their own keywords and subreddits for lead discovery. The system continuously monitors Reddit, filters content, and generates qualified leads.

## ⚙️ Job Architecture

### **JOB 1: Post Collection (Every 45 minutes)**

**Purpose:** Collect fresh posts with relevant keywords
**Process:**

1. Get all active users and their configured subreddits
2. For each subreddit: 1 API call to `/r/subreddit/new.json?limit=100`
3. Filter posts locally against all users' keywords
4. Store matching posts with user association
5. Use `reddit_id` as primary key to prevent duplicates

**Key Points:**

- One API call per subreddit (not per user)
- Multi-tenant keyword matching in memory
- Natural deduplication via database constraints

### **JOB 2: Comment Collection (Every 2 hours)**

**Purpose:** Fetch comments from stored posts
**Process:**

1. Get all posts that need comment updates (haven't been checked recently)
2. For each post: 1 API call to `/r/subreddit/comments/post_id.json`
3. Filter comments locally against user keywords
4. Store matching comments with user association
5. Mark posts as "comments_fetched" with timestamp

**Rate Limiting Strategy:**

- Batch process with 10-minute breaks every 60 requests
- Prioritize newer posts (< 24h old)
- Re-check active posts every 2 hours, older posts daily

### **JOB 3: Lead Generation (After Job 2 Execution)**

**Purpose:** Process raw content into qualified leads
**Process:**

1. Get all unprocessed posts and comments
2. For each piece of content: analyze with GPT for lead qualification
3. Generate lead score (1-10) and reasoning
4. Create lead records for qualified prospects
5. Mark content as processed

**Lead Qualification Criteria:**

- Intent signals (asking for help, seeking recommendations)
- Relevance to user's business
- Author engagement level
- Timing/urgency indicators

### **JOB 4: Data Cleanup (Every 48 hours)**

**Purpose:** Manage database size and costs
**Process:**

1. Delete reddit content older than 48 hours
2. Keep generated leads indefinitely
3. Clean up failed/stale job records

## 🔄 Data Flow

**User Setup:**

1. User configures keywords ("looking for CRM", "need sales tool")
2. User selects subreddits to monitor (r/startups, r/entrepreneur)

**Content Discovery:**

1. Job 1 finds posts matching user keywords
2. Job 2 finds comments on those posts matching keywords
3. Job 3 analyzes all content and creates qualified leads

**Lead Delivery:**

1. User sees qualified leads in dashboard
2. Each lead shows source post/comment, score, and reasoning
3. User can engage directly via Reddit or export for outreach

## 🎯 Multi-Tenant Considerations

**Shared Collection:**

- One API call per subreddit benefits all users monitoring that subreddit
- Keywords from all users are checked against each post/comment
- Efficient resource usage across the platform

**User Isolation:**

- Each user only sees leads from their keywords
- User-specific lead scoring and qualification
- Individual keyword and subreddit management

## 🚨 Error Handling & Monitoring

**Job Dependencies:**

- Job 3 waits for Job 2 completion
- Failed jobs don't block subsequent runs
- Retry mechanisms for API failures

**Rate Limit Protection:**

- Built-in delays between API calls
- Fallback strategies for rate limit hits
- Monitoring and alerting for API issues

**Data Integrity:**

- Duplicate prevention at database level
- Consistent state management across jobs
- Regular data validation checks

```
-- Reddit content storage table (optimized for scale)
CREATE TABLE reddit_content (
  reddit_id TEXT PRIMARY KEY,
  user_ids UUID[] NOT NULL, -- Array of user IDs who have matching keywords
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'comment')),
  parent_post_id TEXT, -- NULL for posts, reddit_id of parent post for comments
  subreddit TEXT NOT NULL,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  matched_keywords TEXT[] NOT NULL, -- All keywords that matched across all users
  comments_last_fetched_at TIMESTAMP, -- NULL for comments, timestamp for posts
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  reddit_created_at TIMESTAMP NOT NULL
);

-- Indexes for performance (critical for scale)
CREATE INDEX idx_reddit_content_user_ids ON reddit_content USING GIN(user_ids); -- GIN index for array queries
CREATE INDEX idx_reddit_content_type_processed ON reddit_content(content_type, is_processed);
CREATE INDEX idx_reddit_content_comments_fetch ON reddit_content(comments_last_fetched_at) WHERE content_type = 'post';
CREATE INDEX idx_reddit_content_cleanup ON reddit_content(created_at);
CREATE INDEX idx_reddit_content_parent_post ON reddit_content(parent_post_id) WHERE content_type = 'comment';

-- Enable Row Level Security
ALTER TABLE reddit_content ENABLE ROW LEVEL SECURITY;
```
