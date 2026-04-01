import type { 
  Sentiment,
  SentimentInput,
  SentimentUpdate,

  Ratio,
  RatioInput,
  RatioUpdate,

  Post,

  Comment,

  User,

  ConfigResponse,
  Error,
  InfiniteScrollParams,
  InfiniteScrollResponse
} from './types'

const API_BASE = '/api'

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
  // Config
  async getConfig(): Promise<ConfigResponse> {
    return request<ConfigResponse>('/config')
  },

  // Control endpoints
  // 🎯 API methods use InfiniteScrollParams and InfiniteScrollResponse types
  // Shapes used by spa_utils useInfiniteScroll

  async getSentiments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Sentiment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Sentiment>>(`/sentiment${query ? `?${query}` : ''}`)
  },

  async getSentiment(sentimentId: string): Promise<Sentiment> {
    return request<Sentiment>(`/sentiment/${sentimentId}`)
  },

  async createSentiment(data: SentimentInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/sentiment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateSentiment(sentimentId: string, data: SentimentUpdate): Promise<Sentiment> {
    return request<Sentiment>(`/sentiment/${sentimentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },


  async getRatios(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Ratio>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Ratio>>(`/ratio${query ? `?${query}` : ''}`)
  },

  async getRatio(ratioId: string): Promise<Ratio> {
    return request<Ratio>(`/ratio/${ratioId}`)
  },

  async createRatio(data: RatioInput): Promise<{ _id: string }> {
    return request<{ _id: string }>('/ratio', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  async updateRatio(ratioId: string, data: RatioUpdate): Promise<Ratio> {
    return request<Ratio>(`/ratio/${ratioId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  },



  // Create endpoints


  // Consume endpoints

  async getPosts(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Post>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Post>>(`/post${query ? `?${query}` : ''}`)
  },

  async getPost(postId: string): Promise<Post> {
    return request<Post>(`/post/${postId}`)
  },


  async getComments(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<Comment>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<Comment>>(`/comment${query ? `?${query}` : ''}`)
  },

  async getComment(commentId: string): Promise<Comment> {
    return request<Comment>(`/comment/${commentId}`)
  },


  async getUsers(params?: InfiniteScrollParams): Promise<InfiniteScrollResponse<User>> {
    const queryParams = new URLSearchParams()
    if (params?.name) queryParams.append('name', params.name)
    if (params?.after_id) queryParams.append('after_id', params.after_id)
    if (params?.limit) queryParams.append('limit', String(params.limit))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.order) queryParams.append('order', params.order)
    
    const query = queryParams.toString()
    return request<InfiniteScrollResponse<User>>(`/user${query ? `?${query}` : ''}`)
  },

  async getUser(userId: string): Promise<User> {
    return request<User>(`/user/${userId}`)
  },


}

export { ApiError }
