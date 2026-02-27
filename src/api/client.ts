import type { 
  sentiment,
  sentimentInput,
  sentimentUpdate,

  ratios,
  ratiosInput,
  ratiosUpdate,

  post,

  comment,

  user,

  DevLoginRequest, 
  DevLoginResponse,
  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

function getDevLoginUrl(): string {
  return '/dev-login'
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Error
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData: Error | null = null
    try {
      errorData = await response.json()
    } catch {
      // Ignore JSON parse errors
    }
    
    // Handle 401 Unauthorized - clear invalid token and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('token_expires_at')
      // Redirect to login page, preserving current path for post-login redirect
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
    }
    
    throw new ApiError(
      errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData || undefined
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

export const api = {
  // Authentication
  async devLogin(payload?: DevLoginRequest): Promise<DevLoginResponse> {
    const url = getDevLoginUrl()
    const token = localStorage.getItem('access_token')
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload || {}),
    })

    if (!response.ok) {
      let errorData: Error | null = null
      try {
        errorData = await response.json()
      } catch {
        // Ignore JSON parse errors
      }
      throw new ApiError(
        errorData?.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData || undefined
      )
    }

    return response.json()
  },

  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // These types are compatible with spa_utils useInfiniteScroll composable

  async getsentiments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<sentiment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<sentiment>>(`/sentiment${query ? `?${query}` : ''}`)
  },

  async getsentiment(sentimentId: string): Promise<sentiment> {
    return request<sentiment>(`/sentiment/${sentimentId}`)
  },

  async createsentiment(data: sentimentInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/sentiment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updatesentiment(sentimentId: string, data: sentimentUpdate): Promise<sentiment> {
    return request<sentiment>(`/sentiment/${sentimentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getratioss(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<ratios>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<ratios>>(`/ratios${query ? `?${query}` : ''}`)
  },

  async getratios(ratiosId: string): Promise<ratios> {
    return request<ratios>(`/ratios/${ratiosId}`)
  },

  async createratios(data: ratiosInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/ratios', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateratios(ratiosId: string, data: ratiosUpdate): Promise<ratios> {
    return request<ratios>(`/ratios/${ratiosId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints


  // Consume endpoints

  async getposts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<post>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<post>>(`/post${query ? `?${query}` : ''}`)
  },

  async getpost(postId: string): Promise<post> {
    return request<post>(`/post/${postId}`)
  },


  async getcomments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<comment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<comment>>(`/comment${query ? `?${query}` : ''}`)
  },

  async getcomment(commentId: string): Promise<comment> {
    return request<comment>(`/comment/${commentId}`)
  },


  async getusers(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<user>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<user>>(`/user${query ? `?${query}` : ''}`)
  },

  async getuser(userId: string): Promise<user> {
    return request<user>(`/user/${userId}`)
  },


}

export { ApiError }
