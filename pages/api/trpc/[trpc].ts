import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { publicProcedure, router } from '@/src/server/trpc';

/**
 * We use the Edge runtime which for sure closes the connection at the 5 minutes mark.
 */
export const runtime = 'edge';

const appRouter = router({
  examples: {
    iterable: publicProcedure.mutation(async function* () {
      for (let i = 0; i < 5 * 60 + 30; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        yield i;
      }
    }),
  },
});

export type AppRouter = typeof appRouter;

export default async function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });
}
