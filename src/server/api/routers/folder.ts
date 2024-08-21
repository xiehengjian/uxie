import { feedbackFormSchema } from "@/lib/utils";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const folderRouter = createTRPCRouter({
    getfolderDocs: protectedProcedure.input(
        z.object({
            id: z.string(),
        }),
    ).query(async ({ ctx, input }) => {
        if (input.id === "no-folder") {
            return await ctx.prisma.document.findMany({
                where: {
                    ownerId: ctx.session.user.id,
                    folderId: null,
                },
            });
        }
        return await ctx.prisma.document.findMany({
            where: {
                ownerId: ctx.session.user.id,
                folderId: input.id,
            },
        });
    }),
    getSubFolders: protectedProcedure.input(
        z.object({
            parentId: z.string().optional(),
        }),
    ).query(async ({ ctx, input }) => {
        const baseWhereConditions = {
            ownerId: ctx.session.user.id,
        };
        // 如果 input.parentId 存在且不为空，则添加到查询条件中
        const whereConditions = {
            ...baseWhereConditions,
            ...(input.parentId ? { parentId: input.parentId } : { parentId: null }),
        };
        return await ctx.prisma.folder.findMany({
            where: whereConditions
        });
    }),
    addFolder: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                parentId: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            try {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        id: ctx.session.user.id,
                    },
                    select: {
                        plan: true,
                        _count: {
                            select: {
                                documents: true,
                            },
                        },
                    },
                });

                if (!user) {
                    throw new TRPCError({
                        code: "UNAUTHORIZED",
                        message: "User not found.",
                    });
                }

                const newFolder = await ctx.prisma.folder.create({
                    data: {
                        name: input.name,
                        owner: {
                            connect: {
                                id: ctx.session.user.id,
                            },
                        },
                        // 根据 parentId 的存在与否决定是否设置 parentFolder
                        parentFolder: input.parentId ? {
                            connect: {
                                id: input.parentId, // 使用提供的 parentId 来连接父文件夹
                            },
                        } : undefined, // 如果没有提供 parentId，就不设置 parentFolder
                    },
                });
                return newFolder;
            } catch (err: any) {
                console.log(err.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message,
                });
            }
        }),
    deleteFolder: protectedProcedure.input(
        z.object({
            folderId: z.string(),
        }),
    ).mutation(async ({ ctx, input }) => {
        try {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    plan: true,
                    _count: {
                        select: {
                            documents: true,
                        },
                    },
                },
            });

            if (!user) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "User not found.",
                });
            }

            const deleteFolder = await ctx.prisma.folder.delete({
                where: {
                    id: input.folderId,
                },
            });
            return deleteFolder;
        } catch (err: any) {
            console.log(err.message);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: err.message,
            });
        }
    }),
    updateFolder: protectedProcedure.input(
        z.object({
            id: z.string(),
            name: z.string(),
        })).mutation(async ({ ctx, input }) => {
            try {
                const user = await ctx.prisma.user.findUnique({
                    where: {
                        id: input.id,
                    },
                    select: {
                        plan: true,
                        _count: {
                            select: {
                                documents: true,
                            },
                        },
                    },
                });

                // if (!user) {
                //     throw new TRPCError({
                //         code: "UNAUTHORIZED",
                //         message: "User not found.",
                //     });
                // }

                const updateFolder = await ctx.prisma.folder.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name,
                    }
                });
                return updateFolder;
            } catch (err: any) {
                console.log(err.message);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: err.message,
                });
            }
        })
});