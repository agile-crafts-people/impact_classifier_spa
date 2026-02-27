import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - user Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all users', async () => {
    const mockusers = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-user',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockusers,
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    const result = await api.getusers()

    expect(result).toEqual(mockResponse)
  })

  it('should get users with name query', async () => {
    const mockResponse = {
      items: [],
      limit: 20,
      has_more: false,
      next_cursor: null
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockResponse
    })

    await api.getusers({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/user?name=test',
      expect.any(Object)
    )
  })

  it('should get a single user', async () => {
    const mockuser = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-user'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockuser
    })

    const result = await api.getuser('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockuser)
  })
})