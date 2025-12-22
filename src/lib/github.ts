import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { getCommitSummary } from "./gemini";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  githubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);
  const { data } = await octokit.rest.repos.listCommits({
    owner: owner ?? "",
    repo: repo ?? "",
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime(),
  ) as any;

  return sortedCommits.slice(0, 10).map((commit: any) => ({
    commitHash: commit.sha as string,
    commitMessage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author.name ?? "",
    commitAuthorAvatar: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author.date ?? "",
  }));
};

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  if (!project || !githubUrl) {
    throw new Error("Project or github url not found");
  }

  const commitHashes = await getCommitHashes(githubUrl);

  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summariesResults = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summariseCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summariesResults.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return "";
  });

  //save into the db  now

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`processing commit ${index}`);
      console.log("summary is: ", summary);
      return {
        projectId: projectId,
        commitMessage: unprocessedCommits[index]?.commitMessage ?? "",
        commitHash: unprocessedCommits[index]?.commitHash ?? "",
        commitAuthorName: unprocessedCommits[index]?.commitAuthorName ?? "",
        commitDate: unprocessedCommits[index]?.commitDate ?? "",
        commitAuthorAvatar: unprocessedCommits[index]?.commitAuthorAvatar ?? "",
        summary: summary,
      };
    }),
  });
  return commits;
};

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId: projectId },
  });

  return commitHashes.filter(
    (commit) =>
      !processedCommits.some((c) => c.commitHash === commit.commitHash),
  );
}

async function fetchProjectGithubUrl(projectId: string) {
  try {
    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        githubUrl: true,
      },
    });

    return { project, githubUrl: project?.githubUrl };
  } catch (err) {
    console.error(err);
    return { project: null, githubUrl: null };
  }
}

async function summariseCommit(githubUrl: string, commitHash: string) {
  console.log("summariseCommit called for", { githubUrl, commitHash });

  try {
    // Normalise githubUrl (it might already be a full URL like https://github.com/owner/repo)
    const repoPath = githubUrl
      .replace(/^https?:\/\/github\.com\//, "") // strip leading domain if present
      .replace(/^\/+/, ""); // strip leading slashes

    // first get the diff
    const { data } = await axios.get(
      `https://github.com/${repoPath}/commit/${commitHash}.diff`,
      {
        headers: {
          Accept: "application/vnd.github.diff",
        },
      },
    );

    const diffText =
      typeof data === "string"
        ? data
        : data?.toString
          ? data.toString()
          : JSON.stringify(data);

    return await getCommitSummary(diffText);
  } catch (error) {
    console.error(
      "Error in summariseCommit while fetching or summarising diff:",
      error,
    );
    // Fallback so we don't end up with completely empty summaries
    return "* Failed to generate summary for this commit.";
  }
}
