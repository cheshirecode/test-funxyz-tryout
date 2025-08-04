// API Configuration
export const apiConfig = {
  apiKey: import.meta.env.VITE_FUNKIT_API_KEY || 'demo_api_key_12345',
  baseUrl: import.meta.env.VITE_FUNKIT_API_BASE_URL || 'https://api.funkit.example.com',
  timeout: 10000,
}

// Environment check
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

// Validate required environment variables
export const validateApiConfig = () => {
  const requiredVars = ['VITE_FUNKIT_API_KEY']
  const missing = requiredVars.filter(varName => !import.meta.env[varName])

  if (missing.length > 0 && isProduction) {
    console.error('Missing required environment variables:', missing)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (missing.length > 0 && isDevelopment) {
    console.warn('Using default values for missing environment variables:', missing)
  }

  return true
}