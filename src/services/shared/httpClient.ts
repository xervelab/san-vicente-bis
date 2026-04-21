import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import { resolveApiPath } from './serviceConfig'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
}

type ApiErrorPayload = {
  message?: string
}

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor to handle errors consistently
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    if (error.message) {
      throw new Error(error.message)
    }
    throw new Error('Request failed')
  }
)

export const httpClient = {
  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const method = (options.method ?? 'GET') as HttpMethod
    const url = resolveApiPath(path)

    switch (method) {
      case 'GET':
        return (await axiosInstance.get<T>(url)).data
      case 'POST':
        return (await axiosInstance.post<T>(url, options.body)).data
      case 'PATCH':
        return (await axiosInstance.patch<T>(url, options.body)).data
      case 'DELETE': {
        const response = await axiosInstance.delete<T | void>(url)
        return response.data as T
      }
      default:
        throw new Error(`Unsupported HTTP method: ${method}`)
    }
  },
  get<T>(path: string) {
    return httpClient.request<T>(path, { method: 'GET' })
  },
  post<T>(path: string, body: unknown) {
    return httpClient.request<T>(path, { method: 'POST', body })
  },
  patch<T>(path: string, body: unknown) {
    return httpClient.request<T>(path, { method: 'PATCH', body })
  },
  delete(path: string) {
    return httpClient.request<void>(path, { method: 'DELETE' })
  },
}