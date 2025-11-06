const KEYWORDS_TO_REPLACE = [
  {
    keyword: "in my experience",
    replacement: [
      "I think",
      "when I was dealing with this",
      "this is what I did",
      "I've dealt with this",
      "in my experience",
    ],
  },
  {
    keyword: "I've been there",
    replacement: [
      "I know what it feels like",
      "I remember this",
      "I know how it feels",
      "I got you",
      "I've been there",
    ],
  },
  {
    keyword: "moved the needle",
    replacement: [
      "moved the needle",
      "improved the results",
      "improved the outcome",
      "enhanced the results",
      "enhanced the performance",
      "helps us a lot",
    ],
  },
  {
    keyword: "tip:",
    replacement: [
      "I'd suggest",
      "I'd recommend",
      "in my opinion",
      "if I were you",
      "what worked for me was",
      "I'd try",
    ],
  },
  {
    keyword: "absolutely",
    replacement: ["definitely", "certainly", "for sure"],
  },
];

export function cleanUpGeneratedComment(content: string): string {
  let cleaned = content;

  // REPLACE KEYWORDS WITH RANDOM ALTERNATIVES
  KEYWORDS_TO_REPLACE.forEach(({ keyword, replacement }) => {
    // CREATE CASE-INSENSITIVE REGEX FOR THE KEYWORD
    const regex = new RegExp(keyword, "gi");

    // REPLACE EACH OCCURRENCE WITH A RANDOM OPTION
    cleaned = cleaned.replace(regex, () => {
      const randomIndex = Math.floor(Math.random() * replacement.length);
      return replacement[randomIndex];
    });
  });

  // REPLACE EM-DASHES WITH COMMA AND SPACE
  cleaned = cleaned.replace(/—/g, ", ");

  // REPLACE SPACED HYPHENS WITH COMMA AND SPACE
  cleaned = cleaned.replace(/\s+-\s+/g, ", ");

  // REPLACE RIGHTWARDS ARROW WITH ASCII ARROW
  cleaned = cleaned.replace(/→/g, "->");

  // CLEAN UP MULTIPLE CONSECUTIVE SPACES BUT PRESERVE NEWLINES
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  // CLEAN UP COMMA FOLLOWED BY MULTIPLE SPACES
  cleaned = cleaned.replace(/,\s+/g, ", ");

  // CLEAN UP 'Short answer:'
  cleaned = cleaned.replace(/^short answer:\s*/i, "");

  // CLEAN UP 'Tip:'
  cleaned = cleaned.replace(/^tip:\s*/i, "");

  // REMOVE PERIODS BEFORE LINE BREAKS
  cleaned = cleaned.replace(/\.\n/g, "\n");

  // DON'T ADD TRIM TO MAINTAIN SPACE BETWEEN PARAGRAPHS
  return cleaned;
}
