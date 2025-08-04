import * as FunkitApi from '@funkit/api-base'
import { apiConfig, validateApiConfig } from '../config/api'

// Validate API configuration on module load
validateApiConfig()

// Create the API client instance - Real HTTP implementation
export const apiClient = {
  async get(url: string) {
    console.log(`GET request to: ${apiConfig.baseUrl}${url}`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout)

    try {
      const response = await fetch(`${apiConfig.baseUrl}${url}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'React-Demo-App/1.0.0'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${apiConfig.timeout}ms`)
      }
      throw error
    }
  },

  async post(url: string, data: any) {
    console.log(`POST request to: ${apiConfig.baseUrl}${url}`, data)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout)

    try {
      const response = await fetch(`${apiConfig.baseUrl}${url}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'React-Demo-App/1.0.0'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${apiConfig.timeout}ms`)
      }
      throw error
    }
  }
}

// Log @funkit/api-base availability for debugging
console.log('@funkit/api-base available exports:', Object.keys(FunkitApi))

// API service functions
export const apiService = {
  // Example API calls
  async getStatus() {
    try {
      const response = await apiClient.get('/status')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('API Status Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  },

  async getUserProfile() {
    try {
      const response = await apiClient.get('/user/profile')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('User Profile Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  },

  async createPost(data: { title: string; content: string }) {
    try {
      const response = await apiClient.post('/posts', data)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Create Post Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  },

  // Real API endpoint to get system information
  async getSystemInfo() {
    try {
      const response = await apiClient.get('/api/v1/system/info')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        success: true,
        data: {
          ...response.data,
          // Include configuration info for demo purposes
          apiKeyMasked: apiConfig.apiKey.substring(0, 8) + '...',
          baseUrl: apiConfig.baseUrl,
          requestTimestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('System Info Error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  },

  // Fallback method for demo purposes when real API is not available
  async getAPIHealthCheck() {
    try {
      const response = await apiClient.get('/health')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Health Check Error:', error)
      // Provide fallback information when API is unreachable
      return {
        success: false,
        error: error instanceof Error ? error.message : 'API endpoint unreachable',
        fallbackInfo: {
          message: 'Real API integration configured',
          apiKeyMasked: apiConfig.apiKey.substring(0, 8) + '...',
          baseUrl: apiConfig.baseUrl,
          features: [
            'Real HTTP requests with fetch API',
            'Authentication headers with Bearer token',
            'Request timeout handling',
            'Proper error handling and logging',
            'JSON request/response processing'
          ]
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