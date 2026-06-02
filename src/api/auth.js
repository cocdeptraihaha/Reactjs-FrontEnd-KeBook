import { apiClient } from './client'

export const authApi = {
  login: (username, password) => {
    const body = new URLSearchParams()
    body.set('username', username)
    body.set('password', password)
    return apiClient.post('/auth/login', body, {
      rawBody: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  },
  register: (payload) => apiClient.post('/auth/register', payload),
  verifyOtp: (payload) => apiClient.post('/auth/verify-otp', payload),
  resendOtp: (payload) => apiClient.post('/auth/resend-otp', payload),
  forgotPassword: (payload) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
}
