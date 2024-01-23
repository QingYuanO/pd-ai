import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { privateProcedure, publicProcedure, router } from './trpc';

export const appRouter = router({
  authCallback: publicProcedure.query(async opts => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user?.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }
    return {
      success: true,
    };
  }),
  getUserFiles: privateProcedure.query(async opts => {
    const { user } = opts.ctx;
    if (!user?.id) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    const files = await db.file.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return files;
  }),
  getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async opts => {
    const { userId } = opts.ctx;
    const { key } = opts.input;
    const file = await db.file.findFirst({
      where: {
        key,
        userId,
      },
    });
    if (!file) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
    return file;
  }),
  deleteFile: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async opts => {
      const { id } = opts.input;
      const { userId } = opts.ctx;
      const file = await db.file.findFirst({
        where: {
          id,
          userId,
        },
      });
      if (!file) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      await db.file.delete({
        where: {
          id,
          userId,
        },
      });
      return file;
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
