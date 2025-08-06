import { useQuery } from '@tanstack/react-query'
import { enhancedApiService } from '@utils/api/enhancedService'

export interface ChainLogoInfo {
  chainId: string
  name: string
  symbol: string
  logoUrl?: string
  iconUrl?: string
  // Fallback properties
  fallbackLogoUrl: string
}

// Fallback chain icons from reliable sources
const FALLBACK_CHAIN_LOGOS: Record<string, string> = {
  '1': 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_ethereum.jpg&w=32&q=75',
  '137':
    'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_polygon.jpg&w=32&q=75',
  '56': 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_bsc.jpg&w=32&q=75',
  '43114':
    'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_avalanche.jpg&w=32&q=75',
  '42161':
    'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_arbitrum.jpg&w=32&q=75',
  '10': 'https://chainlist.org/_next/image?url=https%3A%2F%2Fdefillama.com%2Fchain-icons%2Frsz_optimism.jpg&w=32&q=75',
  '8453': 'https://images.icon-icons.com/1858/PNG/512/iconfinder-cdn-4263517_117865.png', // Base - using generic icon
}

export interface UseChainLogosReturn {
  getChainLogo: (chainId: string) => ChainLogoInfo
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get chain logos from Funkit API with fallbacks
 * Tests if Funkit API provides chain icons and uses fallbacks otherwise
 */
export function useChainLogos(): UseChainLogosReturn {
  // Test a few main chains to see what Funkit API provides
  const testChainIds = ['1', '137', '42161', '10']

  const {
    data: chainInfoResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chain-logos', 'funkit-test'],
    queryFn: async () => {
      console.log('🔍 Testing Funkit API for chain logo information...')

      const results = await Promise.allSettled(
        testChainIds.map(async (chainId) => {
          try {
            const result = await enhancedApiService.getChainInformation(chainId)
            return {
              chainId,
              result,
            }
          } catch (error) {
            console.warn(`Failed to get chain info for ${chainId}:`, error)
            return {
              chainId,
              result: { success: false, error: 'Failed to fetch' },
            }
          }
        })
      )

      return results.map((result, index) => ({
        chainId: testChainIds[index],
        data: result.status === 'fulfilled' ? result.value.result : { success: false },
      }))
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })

  const getChainLogo = (chainId: string): ChainLogoInfo => {
    // Check if we have Funkit API data for this chain
    const chainResult = chainInfoResults?.find((r) => r.chainId === chainId)
    const chainData = chainResult?.data

    let logoUrl: string | undefined
    let name = 'Unknown'
    let symbol = 'Unknown'

    if (chainData?.success && chainData.data) {
      name = chainData.data.chainName || 'Unknown'
      symbol = chainData.data.chainSymbol || 'Unknown'

      // Check if Funkit API provides logo/icon information
      const chainInfo = chainData.data.chainInfo
      logoUrl = chainInfo?.iconUrl || chainInfo?.logoUrl || chainInfo?.icon || chainInfo?.logo

      // Log what we found for debugging
      if (logoUrl) {
        console.log(`✅ Found chain logo from Funkit API for ${chainId}:`, logoUrl)
      } else {
        console.log(
          `⚠️ No chain logo found in Funkit API for ${chainId}, available fields:`,
          Object.keys(chainInfo || {})
        )
      }
    }

    // Use fallback if no logo from API
    const fallbackLogoUrl = FALLBACK_CHAIN_LOGOS[chainId] || FALLBACK_CHAIN_LOGOS['1']

    return {
      chainId,
      name,
      symbol,
      logoUrl,
      fallbackLogoUrl,
    }
  }

  return {
    getChainLogo,
    isLoading,
    error: error as Error | null,
  }
}
