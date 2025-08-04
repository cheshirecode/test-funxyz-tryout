/**
 * Utility functions for handling blockchain chain information and explorer URLs
 */

/**
 * Chain configuration mapping chain IDs to their information
 */
export interface ChainInfo {
  name: string
  explorer: string
  symbol: string
}

export const CHAIN_CONFIG: Record<string, ChainInfo> = {
  '1': {
    name: 'ETH',
    explorer: 'https://etherscan.io',
    symbol: 'ETH'
  },
  '137': {
    name: 'MATIC',
    explorer: 'https://polygonscan.com',
    symbol: 'MATIC'
  },
  '56': {
    name: 'BSC',
    explorer: 'https://bscscan.com',
    symbol: 'BNB'
  },
  '43114': {
    name: 'AVAX',
    explorer: 'https://snowtrace.io',
    symbol: 'AVAX'
  },
  '42161': {
    name: 'ARB',
    explorer: 'https://arbiscan.io',
    symbol: 'ETH'
  },
  '10': {
    name: 'OP',
    explorer: 'https://optimistic.etherscan.io',
    symbol: 'ETH'
  }
}

/**
 * Get chain name from chain ID
 * @param chainId - The chain ID as string
 * @returns Chain name or 'ETH' as default
 */
export const getChainName = (chainId: string): string => {
  return CHAIN_CONFIG[chainId]?.name || 'ETH'
}

/**
 * Get explorer base URL from chain ID
 * @param chainId - The chain ID as string
 * @returns Explorer base URL or Etherscan as default
 */
export const getExplorerBaseUrl = (chainId: string): string => {
  return CHAIN_CONFIG[chainId]?.explorer || 'https://etherscan.io'
}

/**
 * Generate explorer URL for a contract address
 * @param address - The contract address
 * @param chainId - The chain ID as string
 * @returns Full explorer URL for the contract
 */
export const getExplorerUrl = (address: string, chainId: string): string => {
  const baseUrl = getExplorerBaseUrl(chainId)

  // Special case for ETH (0x0000...) - redirect to WETH contract
  if (address === '0x0000000000000000000000000000000000000000') {
    return `${baseUrl}/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
  }

  return `${baseUrl}/address/${address}`
}

/**
 * Get all supported chain IDs
 * @returns Array of supported chain ID strings
 */
export const getSupportedChainIds = (): string[] => {
  return Object.keys(CHAIN_CONFIG)
}

/**
 * Check if a chain ID is supported
 * @param chainId - The chain ID to check
 * @returns True if chain is supported
 */
export const isSupportedChain = (chainId: string): boolean => {
  return chainId in CHAIN_CONFIG
}