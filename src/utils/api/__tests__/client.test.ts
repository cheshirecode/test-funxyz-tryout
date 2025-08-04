import { describe, it, expect, beforeEach, vi } from 'vitest'
import { apiClient } from '../client'
import { apiConfig } from '../config'

// Mock the @funkit/api-base module
vi.mock('@funkit/api-base', () => ({
  getUserUniqueId: vi.fn(),
  getGroups: vi.fn(),
  getUserWalletIdentities: vi.fn(),
  getAllowedAssets: vi.fn(),
  API_BASE_URL: 'https://api.fun.xyz/v1',
  DEV_API_KEY: 'dev_key_123'
}))

// Import the mocked functions
import * as FunkitApi from '@funkit/api-base'

const mockedGetUserUniqueId = vi.mocked(FunkitApi.getUserUniqueId)
const mockedGetGroups = vi.mocked(FunkitApi.getGroups)
const mockedGetUserWalletIdentities = vi.mocked(FunkitApi.getUserWalletIdentities)
const mockedGetAllowedAssets = vi.mocked(FunkitApi.getAllowedAssets)

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getFunkitUserInfo', () => {
    it('should successfully get user info with valid authId', async () => {
      const mockUserUniqueId = 'user_123'
      mockedGetUserUniqueId.mockResolvedValue(mockUserUniqueId)

      const result = await apiClient.getFunkitUserInfo('valid-auth-id')

      expect(result.success).toBe(true)
      expect(result.data?.userUniqueId).toBe(mockUserUniqueId)
      expect(result.data?.authId).toBe('valid-auth-id')
      expect(mockedGetUserUniqueId).toHaveBeenCalledWith({
        apiKey: apiConfig.apiKey,
        authId: 'valid-auth-id'
      })
    })

    it('should handle errors gracefully', async () => {
      const errorMessage = 'User not found'
      mockedGetUserUniqueId.mockRejectedValue(new Error(errorMessage))

      const result = await apiClient.getFunkitUserInfo('invalid-auth-id')

      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
      expect(result.fallbackInfo).toBeDefined()
    })

    it('should use default authId when none provided', async () => {
      const mockUserUniqueId = 'user_123'
      mockedGetUserUniqueId.mockResolvedValue(mockUserUniqueId)

      await apiClient.getFunkitUserInfo()

      expect(mockedGetUserUniqueId).toHaveBeenCalledWith({
        apiKey: apiConfig.apiKey,
        authId: 'demo-auth-id'
      })
    })
  })

  describe('getFunkitUserWallets', () => {
    it('should successfully get user wallets', async () => {
      const mockWalletIdentities = [
        '0x1234567890abcdef1234567890abcdef12345678',
        '0xabcdef1234567890abcdef1234567890abcdef12'
      ] as any
      mockedGetUserWalletIdentities.mockResolvedValue(mockWalletIdentities)

      const result = await apiClient.getFunkitUserWallets(
        'valid-auth-id',
        '0x1234567890abcdef1234567890abcdef12345678'
      )

      expect(result.success).toBe(true)
      expect(result.data?.walletIdentities).toBe(mockWalletIdentities)
      expect(mockedGetUserWalletIdentities).toHaveBeenCalledWith({
        apiKey: apiConfig.apiKey,
        authId: 'valid-auth-id',
        chainId: '1',
        walletAddr: '0x1234567890abcdef1234567890abcdef12345678'
      })
    })

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Wallet not found'
      mockedGetUserWalletIdentities.mockRejectedValue(new Error(errorMessage))

      const result = await apiClient.getFunkitUserWallets()

      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
      expect(result.fallbackInfo).toBeDefined()
    })
  })

  describe('getFunkitAllowedAssets', () => {
    it('should successfully get allowed assets', async () => {
      const mockAllowedAssets = {
        'ETH': { symbol: 'ETH', name: 'Ethereum' },
        'USDC': { symbol: 'USDC', name: 'USD Coin' }
      } as any
      mockedGetAllowedAssets.mockResolvedValue(mockAllowedAssets)

      const result = await apiClient.getFunkitAllowedAssets()

      expect(result.success).toBe(true)
      expect(result.data?.allowedAssets).toBe(mockAllowedAssets)
      expect(mockedGetAllowedAssets).toHaveBeenCalledWith({
        apiKey: apiConfig.apiKey
      })
    })

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Assets not found'
      mockedGetAllowedAssets.mockRejectedValue(new Error(errorMessage))

      const result = await apiClient.getFunkitAllowedAssets()

      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
      expect(result.fallbackInfo).toBeDefined()
    })
  })

  describe('getFunkitUserGroups', () => {
    it('should successfully get user groups', async () => {
      const mockGroups = [
        {
          groupId: 'group1',
          name: 'Group One',
          chainId: '1',
          threshold: 1,
          walletAddr: '0x1234567890abcdef1234567890abcdef12345678',
          memberIds: ['member1']
        },
        {
          groupId: 'group2',
          name: 'Group Two',
          chainId: '1',
          threshold: 2,
          walletAddr: '0xabcdef1234567890abcdef1234567890abcdef12',
          memberIds: ['member2', 'member3']
        }
      ] as any
      mockedGetGroups.mockResolvedValue(mockGroups)

      const result = await apiClient.getFunkitUserGroups()

      expect(result.success).toBe(true)
      expect(result.data?.groups).toBe(mockGroups)
      expect(mockedGetGroups).toHaveBeenCalledWith({
        apiKey: apiConfig.apiKey,
        groupIds: ['0x0000000000000000000000000000000000000001'],
        chainId: '1'
      })
    })

    it('should handle errors gracefully', async () => {
      const errorMessage = 'Groups not found'
      mockedGetGroups.mockRejectedValue(new Error(errorMessage))

      const result = await apiClient.getFunkitUserGroups()

      expect(result.success).toBe(false)
      expect(result.error).toBe(errorMessage)
      expect(result.fallbackInfo).toBeDefined()
    })
  })

  describe('getFunkitAPIDemo', () => {
    it('should run comprehensive API demo', async () => {
      const mockUserUniqueId = 'user_123'
      mockedGetUserUniqueId.mockResolvedValue(mockUserUniqueId)

      const result = await apiClient.getFunkitAPIDemo()

      expect(result.success).toBe(true)
      expect(result.data?.configuration).toBeDefined()
      expect(result.data?.apiCalls).toBeDefined()
      expect(Array.isArray(result.data?.apiCalls)).toBe(true)
    })

    it('should handle demo errors gracefully', async () => {
      // Mock an error that would cause the overall demo to fail
      const errorMessage = 'Demo failed'
      mockedGetUserUniqueId.mockRejectedValue(new Error(errorMessage))

      const result = await apiClient.getFunkitAPIDemo()

      // The demo should still succeed even if individual calls fail
      expect(result.success).toBe(true)
      expect(result.data?.apiCalls).toBeDefined()

      // Check that the failed call is recorded
      const failedCall = result.data?.apiCalls.find((call: any) => call.status === 'error')
      expect(failedCall).toBeDefined()
      expect(failedCall?.error).toBe(errorMessage)
    })
  })
})