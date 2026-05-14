type RawEnv = ImportMetaEnv

function required(key: keyof RawEnv, value: string | undefined): string {
  if (!value) {
    throw new Error(`[env] Missing required environment variable: ${String(key)}`)
  }
  return value
}

export const env = {
  apiBaseUrl: required('VITE_API_BASE_URL', import.meta.env.VITE_API_BASE_URL),
  enableMocks: import.meta.env.VITE_ENABLE_MOCKS === 'true',
  appName: import.meta.env.VITE_APP_NAME ?? 'TaskFlow',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const

export type Env = typeof env
