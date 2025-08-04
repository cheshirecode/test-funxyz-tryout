import { describe, it, expect } from 'vitest'
import {
  CHAIN_CONFIG,
  getChainName,
  getExplorerBaseUrl,
  getExplorerUrl,
  getSupportedChainIds,
  isSupportedChain
} from '../chainUtils'

describe('chainUtils', () => {
  describe('CHAIN_CONFIG', () => {
    it('should contain expected chain configurations', () => {
      expect(CHAIN_CONFIG).toHaveProperty('1')
      expect(CHAIN_CONFIG['1']).toEqual({
        name: 'ETH',
        explorer: 'https://etherscan.io',
        symbol: 'ETH'
      })

      expect(CHAIN_CONFIG).toHaveProperty('137')
      expect(CHAIN_CONFIG['137']).toEqual({
        name: 'MATIC',
        explorer: 'https://polygonscan.com',
        symbol: 'MATIC'
      })
    })

    it('should have all required properties for each chain', () => {
      Object.values(CHAIN_CONFIG).forEach(chain => {
        expect(chain).toHaveProperty('name')
        expect(chain).toHaveProperty('explorer')
        expect(chain).toHaveProperty('symbol')
        expect(typeof chain.name).toBe('string')
        expect(typeof chain.explorer).toBe('string')
        expect(typeof chain.symbol).toBe('string')
      })
    })
  })

  describe('getChainName', () => {
    it('should return correct chain names for supported chains', () => {
      expect(getChainName('1')).toBe('ETH')
      expect(getChainName('137')).toBe('MATIC')
      expect(getChainName('56')).toBe('BSC')
      expect(getChainName('43114')).toBe('AVAX')
      expect(getChainName('42161')).toBe('ARB')
      expect(getChainName('10')).toBe('OP')
    })

    it('should return ETH as default for unsupported chains', () => {
      expect(getChainName('999')).toBe('ETH')
      expect(getChainName('')).toBe('ETH')
      expect(getChainName('unknown')).toBe('ETH')
    })
  })

  describe('getExplorerBaseUrl', () => {
    it('should return correct explorer URLs for supported chains', () => {
      expect(getExplorerBaseUrl('1')).toBe('https://etherscan.io')
      expect(getExplorerBaseUrl('137')).toBe('https://polygonscan.com')
      expect(getExplorerBaseUrl('56')).toBe('https://bscscan.com')
      expect(getExplorerBaseUrl('43114')).toBe('https://snowtrace.io')
      expect(getExplorerBaseUrl('42161')).toBe('https://arbiscan.io')
      expect(getExplorerBaseUrl('10')).toBe('https://optimistic.etherscan.io')
    })

    it('should return Etherscan as default for unsupported chains', () => {
      expect(getExplorerBaseUrl('999')).toBe('https://etherscan.io')
      expect(getExplorerBaseUrl('')).toBe('https://etherscan.io')
      expect(getExplorerBaseUrl('unknown')).toBe('https://etherscan.io')
    })
  })

  describe('getExplorerUrl', () => {
    const testAddress = '0x1234567890123456789012345678901234567890'

    it('should return correct explorer URLs for contract addresses', () => {
      expect(getExplorerUrl(testAddress, '1')).toBe('https://etherscan.io/address/0x1234567890123456789012345678901234567890')
      expect(getExplorerUrl(testAddress, '137')).toBe('https://polygonscan.com/address/0x1234567890123456789012345678901234567890')
    })

    it('should handle zero address (ETH) by redirecting to WETH contract', () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000'
      const expectedWethUrl = 'https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

      expect(getExplorerUrl(zeroAddress, '1')).toBe(expectedWethUrl)

      // Should still use the correct chain's explorer
      expect(getExplorerUrl(zeroAddress, '137')).toBe('https://polygonscan.com/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2')
    })

    it('should use default explorer for unsupported chains', () => {
      expect(getExplorerUrl(testAddress, '999')).toBe('https://etherscan.io/address/0x1234567890123456789012345678901234567890')
    })
  })

  describe('getSupportedChainIds', () => {
    it('should return array of supported chain IDs', () => {
      const chainIds = getSupportedChainIds()
      expect(Array.isArray(chainIds)).toBe(true)
      expect(chainIds).toContain('1')
      expect(chainIds).toContain('137')
      expect(chainIds).toContain('56')
      expect(chainIds).toContain('43114')
      expect(chainIds).toContain('42161')
      expect(chainIds).toContain('10')
    })

    it('should return correct number of supported chains', () => {
      const chainIds = getSupportedChainIds()
      expect(chainIds.length).toBe(Object.keys(CHAIN_CONFIG).length)
    })
  })

  describe('isSupportedChain', () => {
    it('should return true for supported chains', () => {
      expect(isSupportedChain('1')).toBe(true)
      expect(isSupportedChain('137')).toBe(true)
      expect(isSupportedChain('56')).toBe(true)
      expect(isSupportedChain('43114')).toBe(true)
      expect(isSupportedChain('42161')).toBe(true)
      expect(isSupportedChain('10')).toBe(true)
    })

    it('should return false for unsupported chains', () => {
      expect(isSupportedChain('999')).toBe(false)
      expect(isSupportedChain('')).toBe(false)
      expect(isSupportedChain('unknown')).toBe(false)
      expect(isSupportedChain('2')).toBe(false)
    })
  })
})