import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

// GraphQL query for brands data
const brandsQuery = gql`{
  brandActivateds(first: 100) {
    id
    brand
    state
    blockNumber
    blockTimestamp
    transactionHash
  }
  brandRegistryRequesteds(first: 100) {
    id
    brand
    requestId
    blockNumber
    blockTimestamp
    transactionHash
  }
}`

const url = 'https://api.studio.thegraph.com/query/87766/zero/version/latest'
const headers = { Authorization: 'Bearer 6abc6de0d06cbf79f985314ef9647365' }

export interface BrandData {
  id: string
  brand: string
  type: 'hosted' | 'activated' | 'requested'
  status: 'success' | 'in_review' | 'pending' | 'failed' | 'expired'
  blockNumber?: string
  blockTimestamp?: string
  transactionHash?: string
  requestId?: string
  state?: string
  // Additional fields for hosted brands
  brandPermission?: string
  ccip?: string
  chainFunction?: string
  lastUpdated?: number
  locked?: boolean
  merkleVerifier?: string
  oracle?: string
  syncer?: string
  url?: string
}

export interface UseBrandsDataReturn {
  brands: BrandData[]
  hostedBrands: BrandData[]
  activatedBrands: BrandData[]
  requestedBrands: BrandData[]
  isLoading: boolean
  error: any
  refetch: () => void
}

export function useBrandsData(): UseBrandsDataReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['brands-data'],
    queryFn: async () => {
      return await request(url, brandsQuery, {}, headers)
    },
    refetchInterval: 20000, // Refetch every 20 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
  })

  // Hosted brands (mock data - site creators)
  const hostedBrands: BrandData[] = [
    {
      id: 'hosted-1',
      brand: "lesscars1",
      type: 'hosted',
      status: 'success',
      brandPermission: "0x108f8Df99A5edE55ddA08b545db5F6886dc61d74",
      ccip: "0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925",
      chainFunction: "0x1b88549cd82C06875766DF1F6c696c089afad628",
      lastUpdated: 1751336196,
      locked: false,
      merkleVerifier: "0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E",
      oracle: "0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C",
      state: "",
      syncer: "0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c",
      url: "https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1"
    },
    {
      id: 'hosted-2',
      brand: 'BMW',
      type: 'hosted',
      status: 'success',
      brandPermission: '0x8765ssf49982480130we241234r1831430114321',
      ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
      chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
      lastUpdated: 1751336196,
      locked: false,
      merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
      oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
      state: '',
      syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
      url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
    },
    {
      id: 'hosted-3',
      brand: 'Mercedes',
      type: 'hosted',
      status: 'success',
      brandPermission: '0x1111...2222',
      ccip: '0x0b260D2901eCFf1198851B75ED2e3Fcb98Cd8925',
      chainFunction: '0x1b88549cd82C06875766DF1F6c696c089afad628',
      lastUpdated: 1751336196,
      locked: false,
      merkleVerifier: '0x70aAE46FE3F253E80E7Af157cC0E9747dA41fb7E',
      oracle: '0xFE08809ee88B64ecA71dd0A875f32C6B2edf155C',
      state: '',
      syncer: '0x37Cb03A1249A8F3304f0dcbda588e78ce5913B3c',
      url: 'https://www.bing.com/ck/a?!&&p=91faf93b184cfab8e5985150b824ff12ef23785705d6887724dc5f3117220486JmltdHM9MTc1MTE1NTIwMA&ptn=3&ver=2&hsh=4&fclid=015fcb0c-bae6-6d66-038d-de23bb9f6c5b&psq=fwerrari&u=a1aHR0cHM6Ly93d3cuZmVycmFyaS5jb20vZW4tRU4&ntb=1'
    }
  ]

  // Transform activated brands from GraphQL data
  const activatedBrands: BrandData[] = (data as any)?.brandActivateds?.map((item: any) => ({
    id: item.id,
    brand: item.brand,
    type: 'activated' as const,
    status: 'success' as const,
    blockNumber: item.blockNumber,
    blockTimestamp: item.blockTimestamp,
    transactionHash: item.transactionHash,
    state: item.state
  })) || []

  // Transform requested brands from GraphQL data
  const requestedBrands: BrandData[] = (data as any)?.brandRegistryRequesteds?.map((item: any) => ({
    id: item.id,
    brand: item.brand,
    type: 'requested' as const,
    status: 'in_review' as const,
    blockNumber: item.blockNumber,
    blockTimestamp: item.blockTimestamp,
    transactionHash: item.transactionHash,
    requestId: item.requestId
  })) || []

  // Debug logging
  console.log('useBrandsData debug:', {
    activatedBrandsCount: activatedBrands.length,
    requestedBrandsCount: requestedBrands.length,
    activatedBrandsSample: activatedBrands.slice(0, 2),
    requestedBrandsSample: requestedBrands.slice(0, 2)
  })

  // Combine all brands
  const allBrands = [...hostedBrands, ...activatedBrands, ...requestedBrands]

  return {
    brands: allBrands,
    hostedBrands,
    activatedBrands,
    requestedBrands,
    isLoading,
    error,
    refetch
  }
} 