import { apiService } from './api'

// Token interface
export interface TokenData {
  symbol: string
  name: string
  icon: string
  usdPrice: number
  balance: number
  decimals: number
  chainId?: string
  contractAddress?: string
}

// Default token configuration for fallback
const defaultTokens: Record<string, TokenData> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    usdPrice: 1.0,
    balance: 1000,
    decimals: 2,
    chainId: '1',
    contractAddress: '0xA0b86a33E6441b8C4C8C0C8C0C8C0C8C0C8C0C8C'
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    usdPrice: 1.0,
    balance: 500,
    decimals: 2,
    chainId: '1',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    usdPrice: 3500,
    balance: 0.5,
    decimals: 6,
    chainId: '1',
    contractAddress: '0x0000000000000000000000000000000000000000'
  },
  WBTC: {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    usdPrice: 62000,
    balance: 0.01,
    decimals: 8,
    chainId: '1',
    contractAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
  }
}

// Token service for Funkit API integration
export const tokenService = {
  // Get all available tokens with real data from Funkit API
  async getTokens(): Promise<Record<string, TokenData>> {
    try {
      console.log('🔍 Fetching token data from Funkit API...')
      
      // Try to get allowed assets from Funkit API
      const allowedAssetsResult = await apiService.getFunkitAllowedAssets()
      
      if (allowedAssetsResult.success && allowedAssetsResult.data?.allowedAssets) {
        // Transform Funkit API data to our token format
        const tokens: Record<string, TokenData> = {}
        
        // Process allowed assets from Funkit API
        const assets = allowedAssetsResult.data.allowedAssets || []
        
        // Map common tokens to our default structure
        const tokenMapping: Record<string, string> = {
          'USDC': 'USDC',
          'USDT': 'USDT', 
          'ETH': 'ETH',
          'WETH': 'ETH',
          'WBTC': 'WBTC',
          'BTC': 'WBTC'
        }
        
        // Process each asset from Funkit API
        if (Array.isArray(assets)) {
          assets.forEach((asset: any) => {
          const symbol = asset.symbol || asset.name
          const mappedSymbol = tokenMapping[symbol] || symbol
          
                      if (mappedSymbol && defaultTokens[mappedSymbol]) {
              tokens[mappedSymbol] = {
                ...defaultTokens[mappedSymbol],
                usdPrice: asset.price || defaultTokens[mappedSymbol].usdPrice,
                balance: asset.balance || defaultTokens[mappedSymbol].balance,
                chainId: asset.chainId || '1',
                contractAddress: asset.contractAddress || defaultTokens[mappedSymbol].contractAddress
              }
            }
          })
        }
        
        // Fallback to default tokens if no data from API
        if (Object.keys(tokens).length === 0) {
          console.log('⚠️ No token data from Funkit API, using default tokens')
          return defaultTokens
        }
        
        console.log('✅ Successfully fetched token data from Funkit API')
        return tokens
      } else {
        console.log('⚠️ Funkit API call failed, using default tokens')
        return defaultTokens
      }
    } catch (error) {
      console.error('❌ Error fetching token data:', error)
      return defaultTokens
    }
  },

  // Get specific token data
  async getToken(symbol: string): Promise<TokenData | null> {
    const tokens = await this.getTokens()
    return tokens[symbol] || null
  },

  // Get token price from Funkit API
  async getTokenPrice(symbol: string): Promise<number> {
    try {
      const token = await this.getToken(symbol)
      return token?.usdPrice || 0
    } catch (error) {
      console.error(`Error getting price for ${symbol}:`, error)
      return defaultTokens[symbol]?.usdPrice || 0
    }
  },

  // Get user token balances from Funkit API
  async getUserBalances(authId?: string, walletAddr?: string): Promise<Record<string, number>> {
    try {
      console.log('🔍 Fetching user balances from Funkit API...')
      
      const userWalletsResult = await apiService.getFunkitUserWallets(authId, walletAddr as `0x${string}`)
      
      if (userWalletsResult.success && userWalletsResult.data?.walletIdentities) {
        const balances: Record<string, number> = {}
        
        // Process wallet identities from Funkit API
        const wallets = userWalletsResult.data.walletIdentities
        
        wallets.forEach((wallet: any) => {
          if (wallet.assets) {
            wallet.assets.forEach((asset: any) => {
              const symbol = asset.symbol || asset.name
              balances[symbol] = asset.balance || 0
            })
          }
        })
        
        console.log('✅ Successfully fetched user balances from Funkit API')
        return balances
      } else {
        console.log('⚠️ Could not fetch user balances, using default balances')
        const defaultBalances: Record<string, number> = {}
        Object.keys(defaultTokens).forEach(symbol => {
          defaultBalances[symbol] = defaultTokens[symbol].balance
        })
        return defaultBalances
      }
    } catch (error) {
      console.error('❌ Error fetching user balances:', error)
      const defaultBalances: Record<string, number> = {}
      Object.keys(defaultTokens).forEach(symbol => {
        defaultBalances[symbol] = defaultTokens[symbol].balance
      })
      return defaultBalances
    }
  },

  // Update token balances with real data
  async updateTokenBalances(tokens: Record<string, TokenData>): Promise<Record<string, TokenData>> {
    try {
      const balances = await this.getUserBalances()
      
      const updatedTokens = { ...tokens }
      Object.keys(updatedTokens).forEach(symbol => {
        if (balances[symbol] !== undefined) {
          updatedTokens[symbol].balance = balances[symbol]
        }
      })
      
      return updatedTokens
    } catch (error) {
      console.error('❌ Error updating token balances:', error)
      return tokens
    }
  }
}

// Export default tokens for immediate use
export const defaultTokenData = defaultTokens 