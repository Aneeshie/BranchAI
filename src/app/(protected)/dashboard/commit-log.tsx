"use client";

import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";

const CommitLog = () => {
  const { selectedProjectId, project } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({
    projectId: selectedProjectId,
  });

  return (
    <ul className="relative space-y-8">
      {commits?.map((commit, idx) => {
        const isLast = idx === commits.length - 1;

        return (
          <li key={commit.id} className="relative flex gap-4">
            {/* Timeline */}
            <div className="relative flex flex-col items-center">
              <img
                src={commit.commitAuthorAvatar}
                alt="commit avatar"
                className="z-10 size-9 rounded-full border bg-white"
              />
              {!isLast && (
                <div className="absolute top-10 h-full w-px bg-gray-200" />
              )}
            </div>

            {/* Commit Card */}
            <div className="flex-1 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  <span className="font-semibold text-gray-900">
                    {commit.commitAuthorName}
                  </span>{" "}
                  committed
                </span>

                <Link
                  href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 hover:text-gray-900"
                >
                  View
                  <IconExternalLink className="size-4" />
                </Link>
              </div>

              <p className="mt-2 font-medium text-gray-900">
                {commit.commitMessage}
              </p>

              {commit.summary && (
                <pre className="mt-2 text-sm whitespace-pre-wrap text-gray-600">
                  {commit.summary}
                </pre>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CommitLog;
