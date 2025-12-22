"use client";
import useProject from "@/hooks/use-project";
import { IconBrandGithub, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import CommitLog from "./commit-log";

const DashboardPage = () => {
  const { project } = useProject();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/*repo url */}
        <div className="bg-primary flex w-fit rounded-md px-4 py-2">
          <IconBrandGithub className="size-5 text-white" />
          <div className="ml-2">
            <p className="text-sm font-medium text-white">
              This project is linked to{" "}
              <Link
                href={project?.githubUrl ?? ""}
                className="inline-flex items-center text-white/70 hover:underline"
              >
                {project?.githubUrl}
                <IconExternalLink className="ml-1 size-4" />
              </Link>
            </p>
          </div>
        </div>

        <div className="h-5"></div>

        <div className="flex items-center gap-4">
          {/*TODO: SETUP THESE BUTTONS BELOW */}
          TeamMembers InviteButton ArchiveButton
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestion Card Meeting Card
        </div>
      </div>

      <div className="mt-8">
        <CommitLog />
      </div>
    </div>
  );
};

export default DashboardPage;
