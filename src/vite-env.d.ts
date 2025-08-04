/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUNKIT_API_KEY: string
  readonly VITE_FUNKIT_API_BASE_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly SSR: boolean
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}