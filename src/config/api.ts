// API Configuration
export const apiConfig = {
  apiKey: import.meta.env.VITE_FUNKIT_API_KEY || 'Z9SZaOwpmE40KX61mUKWm5hrpGh7WHVkaTvQJBxvdvuKZgfZLfEkLG0z2C5dBKrI',
  baseUrl: import.meta.env.VITE_FUNKIT_API_BASE_URL || 'https://api.fun.xyz/v1',
  timeout: 10000,
}

// Environment check
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

// Validate required environment variables
export const validateApiConfig = () => {
  const envVars = {
    VITE_FUNKIT_API_KEY: import.meta.env.VITE_FUNKIT_API_KEY,
  }

  const missing = Object.entries(envVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key)

  if (missing.length > 0 && isProduction) {
    console.error('Missing required environment variables:', missing)
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }

  if (missing.length > 0 && isDevelopment) {
    console.warn('Using default values for missing environment variables:', missing)
  }

  return true
}