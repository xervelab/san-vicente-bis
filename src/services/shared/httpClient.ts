import { resolveApiPath } from './serviceConfig'

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  body?: unknown
}

type ApiErrorPayload = {
  message?: string
}

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

const parseErrorMessage = async (response: Response) => {
  try {
    const errorPayload = (await response.json()) as ApiErrorPayload
    if (errorPayload.message) {
      return errorPayload.message
    }
  } catch {
    return 'Request failed'
  }

  return `Request failed with status ${response.status}`
}

export const httpClient = {
  async request<T>(path: string, options: RequestOptions = {}) {
    const response = await fetch(resolveApiPath(path), {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response))
    }

    return parseResponse<T>(response)
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