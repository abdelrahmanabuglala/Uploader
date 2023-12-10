import { type UFile } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const filesRouter = createTRPCRouter({
  getAllFiles: publicProcedure.query(async ({ ctx }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const files = (await ctx.db.uFile.findMany()) as unknown as UFile[];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return files;
  }),
});
