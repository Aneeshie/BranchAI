"use client";
import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";

const DashboardPage = () => {
  const { project } = useProject();

  return <div>{`Current project: ${project?.name}`}</div>;
};

export default DashboardPage;
