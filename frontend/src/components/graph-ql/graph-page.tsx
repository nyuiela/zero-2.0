// /app/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { request } from 'graphql-request'
import Data, { query } from './data'


const url = 'https://api.studio.thegraph.com/query/87766/zero/version/latest'
const headers = { Authorization: 'Bearer 6abc6de0d06cbf79f985314ef9647365' }

export default async function HomePage() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query, {}, headers)
    }
  })
  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Data />
    </HydrationBoundary>
  )
}