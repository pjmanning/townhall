import { QueryClient } from '@tanstack/react-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { env, isConvexConfigured } from '#/lib/env'

/**
 * One place that builds the router context. Convex is wired into TanStack Query
 * so `convexQuery(...)` options work anywhere `useQuery` does.
 */
export function getContext() {
  if (!isConvexConfigured) {
    console.warn('[convex] VITE_CONVEX_URL is not set — Convex-backed features are disabled.')
  }

  const convexQueryClient = new ConvexQueryClient(
    env.convexUrl ?? 'https://placeholder.convex.cloud',
  )

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        staleTime: 60_000,
      },
    },
  })

  convexQueryClient.connect(queryClient)

  return {
    queryClient,
    convexClient: convexQueryClient.convexClient,
    convexQueryClient,
  }
}
