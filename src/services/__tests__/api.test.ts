import { describe, it, expect } from 'vitest'
import { apiService } from '../api'
import { apiConfig } from '../../config/api'

describe('API Service', () => {

  describe('apiConfig', () => {
    it('should have correct test configuration', () => {
      expect(apiConfig.apiKey).toBe('test_api_key_12345')
      expect(apiConfig.baseUrl).toBe('https://api.test.example.com')
      expect(apiConfig.timeout).toBe(10000)
    })
  })

  describe('getMockData', () => {
    it('should return successful response with correct structure', async () => {
      const result = await apiService.getMockData()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.message).toBe('Mock data from @funkit/api-base integration')
        expect(result.data.apiKey).toBe('test_api...')
        expect(result.data.baseUrl).toBe(apiConfig.baseUrl)
        expect(result.data.features).toBeInstanceOf(Array)
        expect(result.data.features).toHaveLength(5)
      }
      expect(result.timestamp).toBeDefined()
    })

    it('should include all expected features', async () => {
      const result = await apiService.getMockData()

      if (result.data?.features) {
        expect(result.data.features).toContain('Environment variable configuration')
        expect(result.data.features).toContain('Error handling and logging')
        expect(result.data.features).toContain('Request/response interceptors')
        expect(result.data.features).toContain('Timeout handling')
        expect(result.data.features).toContain('Authentication headers')
      }
    })

    it('should have a valid timestamp', async () => {
      const before = new Date()
      const result = await apiService.getMockData()
      const after = new Date()

      const timestamp = new Date(result.timestamp)
      expect(timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
    })
  })

  describe('createPost', () => {
    it('should handle successful post creation', async () => {
      const postData = { title: 'Test Post', content: 'Test content' }
      const result = await apiService.createPost(postData)

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.message).toBe('Mock post created')
        expect(result.data.title).toBe(postData.title)
        expect(result.data.content).toBe(postData.content)
        expect(result.data.id).toBeDefined()
      }
      expect(result.timestamp).toBeDefined()
    })
  })

    describe('getStatus', () => {
    it('should handle successful status check', async () => {
      const result = await apiService.getStatus()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.message).toBe('Mock response data')
        expect(result.data.url).toBe('/status')
      }
      expect(result.timestamp).toBeDefined()
    })
  })

  describe('getUserProfile', () => {
    it('should handle successful user profile fetch', async () => {
      const result = await apiService.getUserProfile()

      expect(result.success).toBe(true)
      expect(result.data).toBeDefined()
      if (result.data) {
        expect(result.data.message).toBe('Mock response data')
        expect(result.data.url).toBe('/user/profile')
      }
      expect(result.timestamp).toBeDefined()
    })
  })
})