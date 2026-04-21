const trimSlash = (value: string) => value.replace(/\/+$/, '')

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined

export const API_BASE_URL = rawBaseUrl ? trimSlash(rawBaseUrl) : ''

export const USE_HTTP_SERVICES =
  (import.meta.env.VITE_USE_HTTP_SERVICES as string | undefined) === 'true' &&
  API_BASE_URL.length > 0

export const resolveApiPath = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}