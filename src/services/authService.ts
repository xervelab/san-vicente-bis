import type { CurrentUser } from '../types/dashboard'
import { httpClient } from './shared/httpClient'

type AuthResponse<T> = T | { user: T }

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  password_confirmation?: string
}

type ResetPasswordPayload = {
  token: string
  email: string
  password: string
  password_confirmation?: string
}

function extractUser(payload: AuthResponse<CurrentUser>): CurrentUser {
  if (payload && typeof payload === 'object' && 'user' in payload) {
    return payload.user
  }
  return payload as CurrentUser
}

export const authService = {
  async login(payload: LoginPayload): Promise<CurrentUser> {
    const response = await httpClient.post<AuthResponse<CurrentUser>>('/login', payload)
    return extractUser(response)
  },

  async register(payload: RegisterPayload): Promise<CurrentUser> {
    const response = await httpClient.post<AuthResponse<CurrentUser>>('/register', {
      ...payload,
      password_confirmation: payload.password_confirmation ?? payload.password,
    })
    return extractUser(response)
  },

  async logout(): Promise<void> {
    await httpClient.post('/logout', {})
  },

  async forgotPassword(email: string): Promise<{ message?: string }> {
    return httpClient.post<{ message?: string }>('/forgot-password', { email })
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ message?: string }> {
    return httpClient.post<{ message?: string }>('/reset-password', {
      ...payload,
      password_confirmation: payload.password_confirmation ?? payload.password,
    })
  },
}
