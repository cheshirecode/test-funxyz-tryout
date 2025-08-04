import { useQuery } from '@tanstack/react-query'
import { pricingService } from '@api'

/**
 * Hook for getting real-time token price by symbol
 */
export function useTokenPrice(chainId: string, symbol: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['token-price', chainId, symbol],
    queryFn: () => pricingService.getTokenBySymbol(chainId, symbol),
    enabled: enabled && !!chainId && !!symbol,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Hook for getting real-time gas prices
 */
export function useGasPrice(chainId: string = '1', enabled: boolean = true) {
  return useQuery({
    queryKey: ['gas-price', chainId],
    queryFn: () => pricingService.getGasPrice(chainId),
    enabled: enabled && !!chainId,
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}

/**
 * Hook for calculating swap rates with real prices
 */
export function useSwapRate(
  fromChainId: string,
  fromSymbol: string,
  toChainId: string,
  toSymbol: string,
  amount: string = '1',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['swap-rate', fromChainId, fromSymbol, toChainId, toSymbol, amount],
    queryFn: () => pricingService.getSwapRate(fromChainId, fromSymbol, toChainId, toSymbol, amount),
    enabled: enabled && !!fromChainId && !!fromSymbol && !!toChainId && !!toSymbol && !!amount,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

/**
 * Hook for comprehensive pricing demo
 */
export function usePricingDemo(chainId: string = '1', enabled: boolean = false) {
  return useQuery({
    queryKey: ['pricing-demo', chainId],
    queryFn: () => pricingService.getPricingDemo(chainId),
    enabled: enabled && !!chainId,
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook for multiple token prices at once
 */
export function useTokenPrices(tokens: Array<{ chainId: string; symbol: string }>, enabled: boolean = true) {
  return useQuery({
    queryKey: ['token-prices', tokens],
    queryFn: async () => {
      const results = await Promise.allSettled(
        tokens.map(({ chainId, symbol }) =>
          pricingService.getTokenBySymbol(chainId, symbol)
        )
      )

      return tokens.reduce((acc, { chainId, symbol }, index) => {
        const result = results[index]
        acc[`${chainId}-${symbol}`] = result.status === 'fulfilled'
          ? result.value
          : { success: false, error: 'Failed to fetch' }
        return acc
      }, {} as Record<string, any>)
    },
    enabled: enabled && tokens.length > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}