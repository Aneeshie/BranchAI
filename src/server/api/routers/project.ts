import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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

      return project;
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
});
