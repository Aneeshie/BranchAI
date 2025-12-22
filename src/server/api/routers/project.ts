import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { pollCommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
  createProjectRoute: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const clerkUserId = ctx.user.userId;

      const dbUser = await ctx.db.user.findUnique({
        where: {
          clerkId: clerkUserId!,
        },
      });

      if (!dbUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not synced with database",
        });
      }

      try {
        const project = await ctx.db.project.create({
          data: {
            githubUrl: input.githubUrl,
            name: input.name,
            users: {
              create: {
                user: {
                  connect: {
                    id: dbUser.id,
                  },
                },
              },
            },
          },
        });
        await pollCommits(project.id);
        return project;
      } catch (error: any) {
        if (
          error?.code === "P2002" &&
          error?.meta?.target?.includes("githubUrl")
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A project with this GitHub URL already exists.",
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create project.",
          cause: error,
        });
      }
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const clerkUserId = ctx.user.userId;

    const dbUser = await ctx.db.user.findUnique({
      where: { clerkId: clerkUserId! },
    });

    if (!dbUser) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not synced with database",
      });
    }

    return ctx.db.project.findMany({
      where: {
        users: {
          some: {
            userId: dbUser.id,
          },
        },
      },
    });
  }),
  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
      });
    }),
});
