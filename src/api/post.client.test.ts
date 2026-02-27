import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - post Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all posts', async () => {
    const mockposts = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-post',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockposts,
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

    const result = await api.getposts()

    expect(result).toEqual(mockResponse)
  })

  it('should get posts with name query', async () => {
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

    await api.getposts({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/post?name=test',
      expect.any(Object)
    )
  })

  it('should get a single post', async () => {
    const mockpost = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-post'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockpost
    })

    const result = await api.getpost('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockpost)
  })
})