import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

console.log("GEMINI-API_KEY: ", env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

export const getCommitSummary = async (diff: string) => {
  // https://github.com/owner/repo/commit/<commit-hash>.diff

  try {
    const response = await model.generateContent([
      `
You are a senior software engineer reviewing a Git commit.

Your task is to produce a CLEAR, DETAILED, and POINT-WISE summary of the commit diff.

### How to analyze the diff
- Each file starts with metadata (diff --git, index, ---/+++).
- Lines starting with "+" are additions.
- Lines starting with "-" are removals.
- Lines starting with " " are unchanged context.
- The diff may be partial; do NOT assume full file contents.

### Summary rules (IMPORTANT)
- Output a BULLET LIST.
- Use MULTIPLE bullet points if there are multiple logical changes.
- Each bullet should describe ONE meaningful change.
- Focus on:
  - Behavioral changes
  - Bug fixes
  - Refactors
  - API changes
  - Performance or safety improvements
- Avoid low-level noise (imports moved, formatting, renames) unless meaningful.
- Do NOT mention file names.
- Do NOT describe the diff mechanics.
- Do NOT speculate beyond what the diff shows.

### Length & detail
- Each bullet: 1–2 lines max.
- If the commit is small, 1–2 bullets is fine.
- If the commit is complex, use more bullets.

### Output format (STRICT)
- Each line must start with "* "
- No headings
- No intro text
- No conclusion

Example output:
* Added validation to prevent invalid user input from being processed
* Refactored request handling logic to reduce duplicated error checks
* Fixed a crash caused by missing null checks in async workflow
  `,
      `Commit diff:\n${diff}`,
    ]);
    const text = response.response.text().trim();
    console.log("Gemini raw summary text:", text);

    if (!text) {
      return "* No significant changes detected in this commit.";
    }

    return text;
  } catch (error) {
    console.error("Error while generating commit summary with Gemini:", error);
    // Fallback so we don't store an empty summary
    return "* Failed to generate summary for this commit.";
  }
};
