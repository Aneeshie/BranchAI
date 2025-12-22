import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/env";

console.log("GEMINI-API_KEY: ", env.GEMINI_API_KEY);
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const getCommitSummary = async (diff: string) => {
  // https://github.com/owner/repo/commit/<commit-hash>.diff

  try {
    const response = await model.generateContent([
      `You are an expert programmer, and you are trying to summarise a commit diff. 
    Reminders baout the git diff format: 
    For every file, tuere are a few metadata lines, like for example:
    \`\`\`
    diff --git a/src/lib/github.ts b/src/lib/github.ts
    index 1234567890..1234567890 100644
    --- a/src/lib/github.ts
    +++ b/src/lib/github.ts
    \`\`\`
      Then there is the actual diff for the file.
      The diff is a sequence of lines, each line is either a +, -, or a space.
      + means the line was added, - means the line was removed, and a space means the line was unchanged.
      The diff is not a complete file, it is a diff of the file.
      The diff is not a complete commit, it is a diff of the file.
      The diff is not a complete commit, it is a diff of the file.
      EXAMPLE SUMMARY COMMENTS:
      * Raised the amount of returned results from 10 to 20
      * Moved the \`octokit\` to a separate file [src/octokit.ts] [src/index.ts]
      * Fixed a bug in the codebase [src/app/dashboard/page.tsx]
      * Added a new test case to the codebase [src/lib/github.ts]
      * Added an OpenAI API for completions [packages/utils/apis/openai.ts]
      
      Most commits are small changes, so you should focus on the most important changes.
      The summary should be a single sentence, and should be a single line.
      The last comment does not include the file names, because there were more than two relevant files in the hypothetical commit.
      Do not include the file names in the summary.
      It is given only as an example, do not include the file names in the summary.

      The summary should be in the following format:
      * <summary>
      * <summary>
    `,
      `Please summarise the following commit diff: ${diff}`,
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
