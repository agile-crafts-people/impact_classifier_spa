import { describe, it, expect, beforeEach, vi } from 'vitest'
import { api } from './client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('API Client - comment Endpoints', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    localStorage.clear()
    localStorage.setItem('access_token', 'test-token')
  })

  it('should get all comments', async () => {
    const mockcomments = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'test-comment',
        description: 'Test description',
        status: 'active'
      }
    ]

    const mockResponse = {
      items: mockcomments,
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

    const result = await api.getcomments()

    expect(result).toEqual(mockResponse)
  })

  it('should get comments with name query', async () => {
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

    await api.getcomments({ name: 'test' })

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/comment?name=test',
      expect.any(Object)
    )
  })

  it('should get a single comment', async () => {
    const mockcomment = {
      _id: '507f1f77bcf86cd799439011',
      name: 'test-comment'
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: (name: string) => name === 'content-length' ? '100' : null },
      json: async () => mockcomment
    })

    const result = await api.getcomment('507f1f77bcf86cd799439011')

    expect(result).toEqual(mockcomment)
  })
})