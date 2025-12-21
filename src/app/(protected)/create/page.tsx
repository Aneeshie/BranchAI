"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  projectName: string;
  repoUrl: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { handleSubmit, register, reset } = useForm<FormInput>();

  const createProject = api.project.createProjectRoute.useMutation();

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    createProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully!");
          reset();
        },
        onError: () => {
          toast.error("Project could not be created!");
        },
      },
    );
    console.log(data);
  };

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <div>
        <div>
          <h1 className="font-semiBold text-2xl">
            Link Your Github Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your Repository to link it to Branch AI
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              required
              {...register("projectName", { required: true })}
              placeholder="Project Name"
            />
            <div className="h-2"></div>
            <Input
              required
              {...register("repoUrl", { required: true })}
              placeholder="RepoUrl"
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken", { required: false })}
              placeholder="GithubToken (optional)"
            />
            <div className="h-4"></div>
            <Button
              className="cursor-pointer"
              type="submit"
              disabled={createProject.isPending}
            >
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
