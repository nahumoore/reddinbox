export function cleanUpGeneratedComment(content: string): string {
  // REPLACE EM-DASHES WITH COMMA AND SPACE
  let cleaned = content.replace(/—/g, ", ");

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

  // REMOVE LEADING AND TRAILING WHITESPACE
  return cleaned;
}
