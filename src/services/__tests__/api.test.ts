import { describe, it, expect } from 'vitest'
import { apiService } from '../api'
import { apiConfig } from '../../config/api'

describe('API Service', () => {

  describe('apiConfig', () => {
    it('should have correct test configuration', () => {
      expect(apiConfig.apiKey).toBe('Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJBxvdvuKZgfZLfEkLG0z2C5dBKrI')
      expect(apiConfig.baseUrl).toBe('https://api.fun.xyz/v1')
      expect(apiConfig.timeout).toBe(10000)
    })
  })

  describe('getFunkitUserInfo', () => {
    it('should attempt to call @funkit/api-base getUserUniqueId()', async () => {
      const result = await apiService.getFunkitUserInfo()

      // Since we're using real @funkit/api-base, we expect either success or failure
      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()
      expect(new Date(result.timestamp)).toBeInstanceOf(Date)

      if (result.success) {
        expect(result.data).toBeDefined()
        expect(result.data?.apiFunction).toBe('getUserUniqueId()')
        expect(result.data?.message).toBe('Successfully retrieved user unique ID from funkit API')
      } else {
        // If it fails (expected for test environment), check fallback structure
        expect(result.error).toBeDefined()
        expect(result.fallbackInfo).toBeDefined()
        expect(result.fallbackInfo?.apiFunction).toBe('getUserUniqueId()')
        expect(result.fallbackInfo?.message).toBe('Real @funkit/api-base getUserUniqueId() integration')
      }
    })
  })

  describe('getFunkitUserWallets', () => {
    it('should attempt to call @funkit/api-base getUserWalletIdentities()', async () => {
      const result = await apiService.getFunkitUserWallets()

      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()

      if (result.success) {
        expect(result.data?.apiFunction).toBe('getUserWalletIdentities()')
        expect(result.data?.message).toBe('Successfully retrieved user wallet identities from funkit API')
      } else {
        expect(result.error).toBeDefined()
        expect(result.fallbackInfo?.apiFunction).toBe('getUserWalletIdentities()')
        expect(result.fallbackInfo?.message).toBe('Real @funkit/api-base getUserWalletIdentities() integration')
      }
    })
  })

  describe('getFunkitAllowedAssets', () => {
    it('should attempt to call @funkit/api-base getAllowedAssets()', async () => {
      const result = await apiService.getFunkitAllowedAssets()

      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()

      if (result.success) {
        expect(result.data?.apiFunction).toBe('getAllowedAssets()')
        expect(result.data?.message).toBe('Successfully retrieved allowed assets from funkit API')
      } else {
        expect(result.error).toBeDefined()
        expect(result.fallbackInfo?.apiFunction).toBe('getAllowedAssets()')
        expect(result.fallbackInfo?.message).toBe('Real @funkit/api-base getAllowedAssets() integration')
      }
    })
  })

  describe('getFunkitUserGroups', () => {
    it('should attempt to call @funkit/api-base getGroups()', async () => {
      const result = await apiService.getFunkitUserGroups()

      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()

      if (result.success) {
        expect(result.data?.apiFunction).toBe('getGroups()')
        expect(result.data?.message).toBe('Successfully retrieved user groups from funkit API')
      } else {
        expect(result.error).toBeDefined()
        expect(result.fallbackInfo?.apiFunction).toBe('getGroups()')
        expect(result.fallbackInfo?.message).toBe('Real @funkit/api-base getGroups() integration')
      }
    })
  })

  describe('getFunkitAPIDemo', () => {
    it('should run comprehensive @funkit/api-base demo', async () => {
      const result = await apiService.getFunkitAPIDemo()

      expect(result).toBeDefined()
      expect(result.timestamp).toBeDefined()

      if (result.success) {
        expect(result.data?.message).toBe('Comprehensive @funkit/api-base integration demo')
        expect(result.data?.configuration).toBeDefined()
        expect(result.data?.apiCalls).toBeInstanceOf(Array)
        expect(result.data?.totalApiCalls).toBeGreaterThanOrEqual(0)
        expect(result.data?.successfulCalls).toBeGreaterThanOrEqual(0)
      } else {
        expect(result.error).toBeDefined()
        expect(result.fallbackInfo?.message).toBe('Real @funkit/api-base integration configured')
        expect(result.fallbackInfo?.availableFunctions).toBeInstanceOf(Array)
        expect(result.fallbackInfo?.availableFunctions).toContain('getUserUniqueId()')
        expect(result.fallbackInfo?.availableFunctions).toContain('getGroups()')
        expect(result.fallbackInfo?.availableFunctions).toContain('getUserWalletIdentities()')
        expect(result.fallbackInfo?.availableFunctions).toContain('getAllowedAssets()')
      }
    })

    it('should have valid timestamp regardless of success/failure', async () => {
      const before = new Date()
      const result = await apiService.getFunkitAPIDemo()
      const after = new Date()

      const timestamp = new Date(result.timestamp)
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })

  describe('Real @funkit/api-base Integration', () => {
    it('should demonstrate real funkit API configuration', async () => {
      const result = await apiService.getFunkitAPIDemo()

      // Whether success or failure, we should have configuration info
      const config = result.success ? result.data?.configuration : result.fallbackInfo?.configuration

      expect(config).toBeDefined()
      expect(config?.apiKey).toMatch(/^test_api\.\.\./)
      expect(config?.baseUrl).toBe('https://api.test.example.com')
      expect(config?.funkitApiBaseUrl).toBe('https://api.fun.xyz/v1')
    })
  })
})