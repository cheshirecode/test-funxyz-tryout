/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FUNKIT_API_KEY: string
  readonly VITE_FUNKIT_API_BASE_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}