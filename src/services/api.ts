import * as FunkitApi from '@funkit/api-base'
import { apiConfig, validateApiConfig } from '../config/api'

// Extract the functions we need
const {
  getUserUniqueId,
  getGroups,
  getUserWalletIdentities,
  getAllowedAssets,
  API_BASE_URL,
  DEV_API_KEY
} = FunkitApi

// Validate API configuration on module load
validateApiConfig()

// Initialize funkit API with configuration
console.log('Using @funkit/api-base with configuration:', {
  apiKey: apiConfig.apiKey.substring(0, 8) + '...',
  baseUrl: apiConfig.baseUrl,
  funkitApiBaseUrl: API_BASE_URL,
  devApiKey: DEV_API_KEY?.substring(0, 8) + '...' || 'not available'
})

// Real @funkit/api-base integration initialized
console.log('✅ @funkit/api-base functions imported and ready for use')

// API service functions using real @funkit/api-base
export const apiService = {
  // Get user unique ID using funkit API
  async getFunkitUserInfo() {
    try {
      console.log('🔍 Calling getUserUniqueId() from @funkit/api-base')
      const userUniqueId = await getUserUniqueId({ 
        apiKey: apiConfig.apiKey,
        authId: 'demo-auth-id' // Demo value for testing
      })

      return {
        success: true,
        data: {
          userUniqueId,
          message: 'Successfully retrieved user unique ID from funkit API',
          apiFunction: 'getUserUniqueId()'
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Funkit User Info Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real @funkit/api-base getUserUniqueId() integration',
          apiFunction: 'getUserUniqueId()',
          description: 'Attempts to get unique user identifier from funkit platform'
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

    // Get user wallet identities using funkit API
  async getFunkitUserWallets() {
    try {
      console.log('🔍 Calling getUserWalletIdentities() from @funkit/api-base')
      const walletIdentities = await getUserWalletIdentities({ 
        apiKey: apiConfig.apiKey,
        authId: 'demo-auth-id',
        chainId: '1', // Ethereum mainnet for demo
        walletAddr: '0x0000000000000000000000000000000000000000' // Demo wallet address
      })

      return {
        success: true,
        data: {
          walletIdentities,
          message: 'Successfully retrieved user wallet identities from funkit API',
          apiFunction: 'getUserWalletIdentities()'
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Funkit User Wallets Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real @funkit/api-base getUserWalletIdentities() integration',
          apiFunction: 'getUserWalletIdentities()',
          description: 'Attempts to get user wallet identities from funkit platform'
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

    // Get allowed assets using funkit API
  async getFunkitAllowedAssets() {
    try {
      console.log('🔍 Calling getAllowedAssets() from @funkit/api-base')
      const allowedAssets = await getAllowedAssets({ apiKey: apiConfig.apiKey })

      return {
        success: true,
        data: {
          allowedAssets,
          message: 'Successfully retrieved allowed assets from funkit API',
          apiFunction: 'getAllowedAssets()'
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Funkit Allowed Assets Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real @funkit/api-base getAllowedAssets() integration',
          apiFunction: 'getAllowedAssets()',
          description: 'Attempts to get allowed assets from funkit platform'
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

    // Get user groups using funkit API
  async getFunkitUserGroups() {
    try {
      console.log('🔍 Calling getGroups() from @funkit/api-base')
      const groups = await getGroups({ 
        apiKey: apiConfig.apiKey,
        groupIds: ['0x0000000000000000000000000000000000000001'], // Demo group IDs (hex format)
        chainId: '1' // Ethereum mainnet for demo
      })

      return {
        success: true,
        data: {
          groups,
          message: 'Successfully retrieved user groups from funkit API',
          apiFunction: 'getGroups()'
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Funkit User Groups Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real @funkit/api-base getGroups() integration',
          apiFunction: 'getGroups()',
          description: 'Attempts to get user groups from funkit platform'
        },
        timestamp: new Date().toISOString(),
      }
    }
  },

  // Comprehensive funkit API demo
  async getFunkitAPIDemo() {
    try {
      console.log('🚀 Running comprehensive @funkit/api-base demo')

      // Try multiple funkit API calls
      const results = {
        configuration: {
          apiKey: apiConfig.apiKey.substring(0, 8) + '...',
          baseUrl: apiConfig.baseUrl,
          funkitApiBaseUrl: API_BASE_URL,
          devApiKey: DEV_API_KEY?.substring(0, 8) + '...' || 'not available'
        },
        apiCalls: [] as Array<{
          function: string;
          status: 'success' | 'error';
          result?: any;
          error?: string;
        }>
      }

                // Try getUserUniqueId
          try {
            const userUniqueId = await getUserUniqueId({ 
              apiKey: apiConfig.apiKey,
              authId: 'demo-auth-id'
            })
            results.apiCalls.push({
              function: 'getUserUniqueId()',
              status: 'success',
              result: userUniqueId
            })
          } catch (error) {
            results.apiCalls.push({
              function: 'getUserUniqueId()',
              status: 'error',
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }

      return {
        success: true,
        data: {
          ...results,
          message: 'Comprehensive @funkit/api-base integration demo',
          totalApiCalls: results.apiCalls.length,
          successfulCalls: results.apiCalls.filter(call => call.status === 'success').length
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Funkit API Demo Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackInfo: {
          message: 'Real @funkit/api-base integration configured',
          availableFunctions: [
            'getUserUniqueId()',
            'getGroups()',
            'getUserWalletIdentities()',
            'getAllowedAssets()',
            'getAssetPriceInfo()',
            'getChainFromId()',
            'createUser()'
          ],
          configuration: {
            apiKey: apiConfig.apiKey.substring(0, 8) + '...',
            baseUrl: apiConfig.baseUrl,
            funkitApiBaseUrl: API_BASE_URL
          }
        },
        timestamp: new Date().toISOString(),
      }
    }
  }
}

// Export types for better TypeScript support
export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}