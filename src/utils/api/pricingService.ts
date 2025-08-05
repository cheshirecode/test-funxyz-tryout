import * as FunkitApi from '@funkit/api-base'
import { apiConfig } from './config'

// Extract pricing and gas functions
const {
  getAssetPriceInfo,
  getUserOpGasPrice,
  getAssetErc20ByChainAndSymbol,
} = FunkitApi

/**
 * Enhanced pricing service using real @funkit/api-base functions
 * Provides real-time token pricing and gas estimation for the swap UI
 */
export const pricingService = {
    /**
   * Get real-time token price information
   */
  async getTokenPrice(chainId: string, tokenAddress: `0x${string}`) {
    try {
      console.log('🔍 Getting real token price from @funkit/api-base')
      
      const priceInfo = await getAssetPriceInfo({
        apiKey: apiConfig.apiKey,
        chainId,
        assetTokenAddress: tokenAddress,
      })

      return {
        success: true,
        data: {
          priceInfo,
          chainId,
          tokenAddress,
          price: priceInfo?.unitPrice || 0,
          priceUsd: priceInfo?.unitPrice || 0,
          message: 'Successfully retrieved real token price from @funkit/api-base',
          apiFunction: 'getAssetPriceInfo()',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real-time pricing with @funkit/api-base',
          function: 'getAssetPriceInfo',
          description: 'Get current market price for any token',
          chainId,
          tokenAddress,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Get token metadata and price by symbol
   */
  async getTokenBySymbol(chainId: string, symbol: string) {
    try {
      console.log('🔍 Getting token metadata and price by symbol from @funkit/api-base')

      // First get token metadata
      const tokenInfo = await getAssetErc20ByChainAndSymbol({
        apiKey: apiConfig.apiKey,
        chainId,
        symbol,
      })

      if (!tokenInfo?.address) {
        throw new Error(`Token ${symbol} not found on chain ${chainId}`)
      }

      // Then get price info
      const priceInfo = await getAssetPriceInfo({
        apiKey: apiConfig.apiKey,
        chainId,
        assetTokenAddress: tokenInfo.address as `0x${string}`,
      })

      return {
        success: true,
        data: {
          tokenInfo,
          priceInfo,
          symbol,
          chainId,
          tokenAddress: tokenInfo.address,
          decimals: tokenInfo.decimals,
          name: tokenInfo.name,
          price: priceInfo?.unitPrice || 0,
          priceUsd: priceInfo?.unitPrice || 0,
          message: 'Successfully retrieved token metadata and price from @funkit/api-base',
          apiFunction: 'getAssetErc20ByChainAndSymbol() + getAssetPriceInfo()',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced token discovery with pricing',
          functions: ['getAssetErc20ByChainAndSymbol', 'getAssetPriceInfo'],
          description: 'Get token metadata and current market price by symbol',
          chainId,
          symbol,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Get current gas prices for transactions
   */
  async getGasPrice(chainId: string = '1') {
    try {
      console.log('🔍 Getting real gas prices from @funkit/api-base')

      const gasPrice = await getUserOpGasPrice({
        apiKey: apiConfig.apiKey,
        chainId,
      })

      // Convert bigint values to decimal
      const maxFeePerGasWei = Number(gasPrice.maxFeePerGas)
      // const maxPriorityFeePerGasWei = Number(gasPrice.maxPriorityFeePerGas)
      
      // Use maxFeePerGas as the main gas price
      const gasPriceWei = maxFeePerGasWei
      const gasPriceGwei = gasPriceWei / 1e9
      const gasPriceEth = gasPriceWei / 1e18

      return {
        success: true,
        data: {
          gasPrice,
          chainId,
          gasPriceWei,
          gasPriceGwei,
          gasPriceEth,
          // Estimate costs for different transaction types
          estimatedCosts: {
            simpleTransfer: {
              gasLimit: 21000,
              costWei: gasPriceWei * 21000,
              costGwei: (gasPriceWei * 21000) / 1e9,
              costEth: (gasPriceWei * 21000) / 1e18,
            },
            tokenSwap: {
              gasLimit: 150000, // Typical DEX swap
              costWei: gasPriceWei * 150000,
              costGwei: (gasPriceWei * 150000) / 1e9,
              costEth: (gasPriceWei * 150000) / 1e18,
            },
            complexDeFi: {
              gasLimit: 300000, // Complex DeFi operations
              costWei: gasPriceWei * 300000,
              costGwei: (gasPriceWei * 300000) / 1e9,
              costEth: (gasPriceWei * 300000) / 1e18,
            },
          },
          message: 'Successfully retrieved real gas prices from @funkit/api-base',
          apiFunction: 'getUserOpGasPrice()',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real-time gas pricing with @funkit/api-base',
          function: 'getUserOpGasPrice',
          description: 'Get current gas prices for transaction cost estimation',
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Calculate swap exchange rate with real prices
   */
  async getSwapRate(
    fromChainId: string,
    fromSymbol: string,
    toChainId: string,
    toSymbol: string,
    amount: string = '1'
  ) {
    try {
      console.log('🔍 Calculating swap rate with real prices from @funkit/api-base')

      const [fromToken, toToken] = await Promise.all([
        this.getTokenBySymbol(fromChainId, fromSymbol),
        this.getTokenBySymbol(toChainId, toSymbol),
      ])

      if (!fromToken.success || !toToken.success) {
        throw new Error('Failed to get token price data for swap calculation')
      }

      const fromPrice = fromToken.data?.priceUsd || 0
      const toPrice = toToken.data?.priceUsd || 0

      if (fromPrice === 0 || toPrice === 0) {
        throw new Error('Price data not available for one or both tokens')
      }

      const amountNum = parseFloat(amount) || 1
      const exchangeRate = fromPrice / toPrice
      const outputAmount = amountNum * exchangeRate

      return {
        success: true,
        data: {
          fromToken: fromToken.data,
          toToken: toToken.data,
          inputAmount: amountNum,
          outputAmount,
          exchangeRate,
          fromPrice,
          toPrice,
          priceImpact: 0, // Would need DEX integration for real price impact
          route: `${fromSymbol} → ${toSymbol}`,
          message: 'Successfully calculated swap rate with real prices from @funkit/api-base',
          apiFunction: 'getAssetErc20ByChainAndSymbol() + getAssetPriceInfo() for both tokens',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real-time swap rate calculation',
          functions: ['getAssetErc20ByChainAndSymbol', 'getAssetPriceInfo'],
          description: 'Calculate exchange rates using real market prices',
          fromChainId,
          fromSymbol,
          toChainId,
          toSymbol,
          amount,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Comprehensive pricing demo
   */
  async getPricingDemo(chainId: string = '1') {
    try {
      console.log('🚀 Running comprehensive pricing demo with @funkit/api-base')

      const demoTokens = ['USDC', 'ETH', 'WBTC']
      const results = {
        chainId,
        configuration: {
          apiKey: apiConfig.apiKey.substring(0, 8) + '...',
        },
        tokenPrices: {} as Record<string, any>,
        gasEstimation: null as any,
        swapRates: {} as Record<string, any>,
        errors: [] as string[],
      }

      // Get prices for demo tokens
      for (const symbol of demoTokens) {
        try {
          const tokenData = await this.getTokenBySymbol(chainId, symbol)
          results.tokenPrices[symbol] = tokenData.success ? tokenData.data : tokenData.error
        } catch (error) {
          results.errors.push(`${symbol}: ${error instanceof Error ? error.message : 'Unknown'}`)
        }
      }

      // Get gas estimation
      try {
        const gasData = await this.getGasPrice(chainId)
        results.gasEstimation = gasData.success ? gasData.data : gasData.error
      } catch (error) {
        results.errors.push(`Gas estimation: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Calculate some example swap rates
      const swapPairs = [
        { from: 'USDC', to: 'ETH' },
        { from: 'ETH', to: 'WBTC' },
        { from: 'WBTC', to: 'USDC' },
      ]

      for (const pair of swapPairs) {
        try {
          const swapData = await this.getSwapRate(chainId, pair.from, chainId, pair.to, '1000')
          results.swapRates[`${pair.from}-${pair.to}`] = swapData.success ? swapData.data : swapData.error
        } catch (error) {
          results.errors.push(`${pair.from}-${pair.to}: ${error instanceof Error ? error.message : 'Unknown'}`)
        }
      }

      return {
        success: true,
        data: {
          ...results,
          message: 'Comprehensive real-time pricing demo with @funkit/api-base',
          totalTokens: demoTokens.length,
          successfulPrices: Object.keys(results.tokenPrices).filter(
            k => results.tokenPrices[k] && typeof results.tokenPrices[k] === 'object' && results.tokenPrices[k].price
          ).length,
          totalSwapRates: swapPairs.length,
          successfulSwapRates: Object.keys(results.swapRates).filter(
            k => results.swapRates[k] && typeof results.swapRates[k] === 'object' && results.swapRates[k].exchangeRate
          ).length,
          errorCount: results.errors.length,
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real-time pricing and gas estimation showcase',
          functions: ['getAssetPriceInfo', 'getUserOpGasPrice', 'getAssetErc20ByChainAndSymbol'],
          description: 'Comprehensive demo of real-time pricing and gas estimation capabilities',
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },
}

// Export types for better TypeScript support
export type PricingApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  fallbackInfo?: any
  timestamp: string
}