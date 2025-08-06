import { useQuery } from '@tanstack/react-query'

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
  '1': 'https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg',
  '137': 'https://icons.llamao.fi/icons/chains/rsz_polygon.jpg',
  '56': 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
  '43114': 'https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg',
  '42161': 'https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg',
  '10': 'https://icons.llamao.fi/icons/chains/rsz_optimism.jpg',
  '8453': 'https://icons.llamao.fi/icons/chains/rsz_base.jpg',
}

interface ChainListChain {
  chainId: number
  name: string
  chain: string
  icon?: string
  rpc: string[]
  faucets: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  infoURL: string
  shortName: string
  networkId: number
  slip44?: number
  ens?: {
    registry: string
  }
  explorers?: Array<{
    name: string
    url: string
    standard: string
  }>
}

export interface UseChainLogosReturn {
  getChainLogo: (chainId: string) => ChainLogoInfo
  isLoading: boolean
  error: Error | null
}

/**
 * Hook to get chain logos from chainlist API with fallbacks
 * Uses chainid.network chains.json for accurate chain data and icons
 */
export function useChainLogos(): UseChainLogosReturn {
  const {
    data: chainListData,
    isLoading,
    error,
  } = useQuery<ChainListChain[]>({
    queryKey: ['chain-logos', 'chainlist'],
    queryFn: async (): Promise<ChainListChain[]> => {
      console.log('🔍 Fetching chain information from chainlist API...')

      const response = await window.fetch('https://chainid.network/chains.json')
      if (!response.ok) {
        throw new Error(`Failed to fetch chains: ${response.statusText}`)
      }

      const chains = await response.json()
      console.log('✅ Successfully fetched chain data from chainlist')
      return chains
    },
    staleTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
  })

  const getChainLogo = (chainId: string): ChainLogoInfo => {
    const chainIdNumber = parseInt(chainId, 10)

    // Find chain data from chainlist
    const chainData = chainListData?.find((chain) => chain.chainId === chainIdNumber)

    let logoUrl: string | undefined
    let name = 'Unknown'
    let symbol = 'Unknown'

    if (chainData) {
      name = chainData.name || chainData.chain || 'Unknown'
      symbol = chainData.nativeCurrency?.symbol || 'Unknown'

      // Chainlist provides icon as relative path, need to construct full URL
      if (chainData.icon) {
        logoUrl = `https://icons.llamao.fi/icons/chains/rsz_${chainData.icon.replace('ipfs://', '')}.jpg`
        console.log(`✅ Found chain logo from chainlist for ${chainId}: ${logoUrl}`)
      } else {
        console.log(`⚠️ No icon found in chainlist for chain ${chainId}`)
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
