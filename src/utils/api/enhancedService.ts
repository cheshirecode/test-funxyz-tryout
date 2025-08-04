import * as FunkitApi from '@funkit/api-base'
import { apiConfig } from './config'

// Extract enhanced functions we want to explore
const {
  getAllWalletTokens,
  getAllWalletTokensByChainId,
  getAllWalletNFTs,
  getAllWalletNFTsByChainId,
  getChainFromId,
  getUserOpGasPrice,
  getAssetFromFaucet,
  getNftAddress,
  getNftName,
  getRiskAssessmentForAddress,
} = FunkitApi

/**
 * Enhanced API Service showcasing additional @funkit/api-base capabilities
 * beyond the basic functions currently used in the application
 */
export const enhancedApiService = {
  /**
   * Portfolio Management Functions
   * Get comprehensive token and NFT holdings
   */
  async getWalletPortfolio(walletAddress: `0x${string}`, chainId?: string) {
    try {
      console.log('🔍 Getting complete wallet portfolio from @funkit/api-base')

      const results = {
        walletAddress,
        chainId: chainId || 'all',
        tokens: null as any,
        nfts: null as any,
        errors: [] as string[],
      }

      // Get all tokens for the wallet
      try {
        if (chainId) {
          results.tokens = await getAllWalletTokensByChainId({
            apiKey: apiConfig.apiKey,
            walletAddress: walletAddress,
            chainId,
            onlyVerifiedTokens: false,
          })
        } else {
          results.tokens = await getAllWalletTokens({
            apiKey: apiConfig.apiKey,
            walletAddress: walletAddress,
            onlyVerifiedTokens: false,
          })
        }
      } catch (error) {
        results.errors.push(`Token fetch error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Get all NFTs for the wallet
      try {
        if (chainId) {
          results.nfts = await getAllWalletNFTsByChainId({
            apiKey: apiConfig.apiKey,
            walletAddress: walletAddress,
            chainId,
          })
        } else {
          results.nfts = await getAllWalletNFTs({
            apiKey: apiConfig.apiKey,
            walletAddress: walletAddress,
          })
        }
      } catch (error) {
        results.errors.push(`NFT fetch error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      return {
        success: true,
        data: {
          ...results,
          message: 'Successfully retrieved wallet portfolio from @funkit/api-base',
          apiFunction: chainId ? 'getAllWalletTokensByChainId() + getAllWalletNFTsByChainId()' : 'getAllWalletTokens() + getAllWalletNFTs()',
          hasTokens: !!results.tokens,
          hasNfts: !!results.nfts,
          errorCount: results.errors.length,
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced portfolio management with @funkit/api-base',
          functions: ['getAllWalletTokens', 'getAllWalletTokensByChainId', 'getAllWalletNFTs', 'getAllWalletNFTsByChainId'],
          description: 'Get complete token and NFT portfolio for any wallet address',
          walletAddress,
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Chain Information Functions
   * Get detailed chain metadata
   */
  async getChainInformation(chainId: string) {
    try {
      console.log('🔍 Getting chain information from @funkit/api-base')

      const chainInfo = await getChainFromId({ 
        apiKey: apiConfig.apiKey,
        chainId 
      })

      return {
        success: true,
        data: {
          chainInfo,
          chainId,
          message: 'Successfully retrieved chain information from @funkit/api-base',
          apiFunction: 'getChainFromId()',
          chainName: chainInfo?.name || 'Unknown',
          chainSymbol: chainInfo?.nativeCurrency?.symbol || 'Unknown',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced chain information with @funkit/api-base',
          functions: ['getChainFromId', 'getChainFromName'],
          description: 'Get detailed chain metadata including name, symbol, and configuration',
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Gas & Transaction Estimation
   * Get gas prices and operation estimates
   */
  async getGasEstimation(chainId: string = '1') {
    try {
      console.log('🔍 Getting gas estimation from @funkit/api-base')

      const gasPrice = await getUserOpGasPrice({
        apiKey: apiConfig.apiKey,
        chainId,
      })

      return {
        success: true,
        data: {
          gasPrice,
          chainId,
          message: 'Successfully retrieved gas estimation from @funkit/api-base',
          apiFunction: 'getUserOpGasPrice()',
          gasPriceWei: gasPrice,
          // Convert to common units
          gasPriceGwei: gasPrice ? Number(gasPrice) / 1e9 : null,
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced gas estimation with @funkit/api-base',
          functions: ['getUserOpGasPrice', 'estimateOp'],
          description: 'Get real-time gas prices and transaction cost estimates',
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * NFT Metadata Functions
   * Get detailed NFT information
   */
  async getNFTMetadata(contractAddress: `0x${string}`, chainId: string = '1') {
    try {
      console.log('🔍 Getting NFT metadata from @funkit/api-base')

      const results = {
        contractAddress,
        chainId,
        nftName: null as any,
        nftAddress: null as any,
        errors: [] as string[],
      }

      // Get NFT name
      try {
        results.nftName = await getNftName({
          apiKey: apiConfig.apiKey,
          nftAddress: contractAddress,
          chainId,
        })
      } catch (error) {
        results.errors.push(`NFT name error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Get NFT address info
      try {
        results.nftAddress = await getNftAddress({
          apiKey: apiConfig.apiKey,
          nftAddress: contractAddress,
          chainId,
        })
      } catch (error) {
        results.errors.push(`NFT address error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      return {
        success: true,
        data: {
          ...results,
          message: 'Successfully retrieved NFT metadata from @funkit/api-base',
          apiFunction: 'getNftName() + getNftAddress()',
          hasName: !!results.nftName,
          hasAddress: !!results.nftAddress,
          errorCount: results.errors.length,
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced NFT metadata with @funkit/api-base',
          functions: ['getNftName', 'getNftAddress'],
          description: 'Get detailed NFT collection and contract information',
          contractAddress,
          chainId,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Security & Risk Assessment
   * Get address risk information
   */
  async getAddressRiskAssessment(address: `0x${string}`) {
    try {
      console.log('🔍 Getting address risk assessment from @funkit/api-base')

      const riskAssessment = await getRiskAssessmentForAddress({
        apiKey: apiConfig.apiKey,
        address,
      })

      return {
        success: true,
        data: {
          riskAssessment,
          address,
          message: 'Successfully retrieved address risk assessment from @funkit/api-base',
          apiFunction: 'getRiskAssessmentForAddress()',
          riskLevel: riskAssessment?.risk || 'Unknown',
          riskScore: riskAssessment?.riskScore || null,
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced security with @funkit/api-base',
          functions: ['getRiskAssessmentForAddress'],
          description: 'Get security risk assessment for wallet addresses',
          address,
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Faucet Integration
   * Get test tokens for development
   */
  async getTestTokensFromFaucet(chainId: string, symbol: string, amount?: string) {
    try {
      console.log('🔍 Getting test tokens from faucet via @funkit/api-base')

      const faucetResult = await getAssetFromFaucet({
        apiKey: apiConfig.apiKey,
        chain: chainId,
        assetSymbol: symbol,
        amount: amount || '1000',
      })

      return {
        success: true,
        data: {
          faucetResult,
          chainId,
          symbol,
          amount: amount || '1000',
          message: 'Successfully retrieved test tokens from faucet via @funkit/api-base',
          apiFunction: 'getAssetFromFaucet()',
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced faucet integration with @funkit/api-base',
          functions: ['getAssetFromFaucet'],
          description: 'Get test tokens for development and testing',
          chainId,
          symbol,
          amount: amount || '1000',
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  /**
   * Comprehensive Enhanced Demo
   * Showcase multiple enhanced capabilities
   */
  async getEnhancedAPIDemo(walletAddress?: `0x${string}`, chainId: string = '1') {
    try {
      console.log('🚀 Running comprehensive enhanced @funkit/api-base demo')

      const demoWallet = walletAddress || '0x742d35Cc6634C0532925a3b8D84D8C23F8A76542' // Example wallet

      const results = {
        configuration: {
          apiKey: apiConfig.apiKey.substring(0, 8) + '...',
          walletAddress: demoWallet,
          chainId,
        },
        capabilities: {
          portfolio: null as any,
          chainInfo: null as any,
          gasEstimation: null as any,
          nftMetadata: null as any,
          riskAssessment: null as any,
        },
        errors: [] as string[],
      }

      // Test portfolio functions
      try {
        const portfolioResult = await this.getWalletPortfolio(demoWallet, chainId)
        results.capabilities.portfolio = portfolioResult.success ? portfolioResult.data : portfolioResult.error
      } catch (error) {
        results.errors.push(`Portfolio error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Test chain info
      try {
        const chainResult = await this.getChainInformation(chainId)
        results.capabilities.chainInfo = chainResult.success ? chainResult.data : chainResult.error
      } catch (error) {
        results.errors.push(`Chain info error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Test gas estimation
      try {
        const gasResult = await this.getGasEstimation(chainId)
        results.capabilities.gasEstimation = gasResult.success ? gasResult.data : gasResult.error
      } catch (error) {
        results.errors.push(`Gas estimation error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      // Test risk assessment
      try {
        const riskResult = await this.getAddressRiskAssessment(demoWallet)
        results.capabilities.riskAssessment = riskResult.success ? riskResult.data : riskResult.error
      } catch (error) {
        results.errors.push(`Risk assessment error: ${error instanceof Error ? error.message : 'Unknown'}`)
      }

      return {
        success: true,
        data: {
          ...results,
          message: 'Comprehensive enhanced @funkit/api-base capabilities demonstration',
          totalCapabilities: Object.keys(results.capabilities).length,
          successfulCapabilities: Object.values(results.capabilities).filter(cap => cap && typeof cap === 'object' && cap.message).length,
          errorCount: results.errors.length,
          enhancedFunctions: [
            'getAllWalletTokens', 'getAllWalletNFTs', 'getChainFromId',
            'getUserOpGasPrice', 'getRiskAssessmentForAddress', 'getNftName'
          ],
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Enhanced @funkit/api-base capabilities showcase',
          totalFunctions: 128,
          currentlyUsed: 4,
          enhancedCapabilities: [
            'Portfolio Management (tokens + NFTs)',
            'Chain Information & Metadata',
            'Gas Estimation & Pricing',
            'NFT Collection Metadata',
            'Security Risk Assessment',
            'Faucet Integration',
            'Fiat On/Off Ramps (Stripe, Moonpay)',
            'Cross-chain Operations',
            'Advanced Transaction Management'
          ],
        },
        timestamp: new Date().toISOString(),
      }
    }
  },
}

// Export types for better TypeScript support
export type EnhancedApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  fallbackInfo?: any
  timestamp: string
}