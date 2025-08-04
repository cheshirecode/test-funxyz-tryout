import * as FunkitApi from '@funkit/api-base'
import { apiConfig, validateApiConfig } from '../config/api'

// Validate API configuration on module load
validateApiConfig()

// Create the API client instance - using a mock implementation for demo
// In a real app, this would use the actual @funkit/api-base client
export const apiClient = {
  async get(url: string) {
    console.log(`Mock GET request to: ${apiConfig.baseUrl}${url}`)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: { message: 'Mock response data', url },
      status: 200,
      statusText: 'OK'
    }
  },
  async post(url: string, data: any) {
    console.log(`Mock POST request to: ${apiConfig.baseUrl}${url}`, data)
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      data: { message: 'Mock post created', id: Date.now(), ...data },
      status: 201,
      statusText: 'Created'
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

  // Mock endpoint for demonstration (since we don't have a real API)
  async getMockData() {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        data: {
          message: 'Mock data from @funkit/api-base integration',
          apiKey: apiConfig.apiKey.substring(0, 8) + '...',
          baseUrl: apiConfig.baseUrl,
          features: [
            'Environment variable configuration',
            'Error handling and logging',
            'Request/response interceptors',
            'Timeout handling',
            'Authentication headers'
          ]
        },
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
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