// Type definitions based on OpenAPI spec

export interface Error {
  error: string
}

export interface Breadcrumb {
  from_ip: string
  by_user: string
  at_time: string
  correlation_id: string
}


// Sentiment Domain
export interface Sentiment {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface SentimentInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface SentimentUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// Ratio Domain
export interface Ratio {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface RatioInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface RatioUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}



// Post Domain
export interface Post {
  _id: string
  name: string
  description?: string
  status?: string
}

// Comment Domain
export interface Comment {
  _id: string
  name: string
  description?: string
  status?: string
}

// User Domain
export interface User {
  _id: string
  name: string
  description?: string
  status?: string
}


// Configuration
export interface ConfigResponse {
  config_items: unknown[]
  versions: unknown[]
  enumerators: unknown[]
  token?: {
    claims?: Record<string, unknown>
  }
}

// Infinite Scroll
export interface InfiniteScrollParams {
  name?: string
  after_id?: string
  limit?: number
  sort_by?: string
  order?: 'asc' | 'desc'
}

export interface InfiniteScrollResponse<T> {
  items: T[]
  limit: number
  has_more: boolean
  next_cursor: string | null
}
