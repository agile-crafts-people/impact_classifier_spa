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


// sentiment Domain
export interface sentiment {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface sentimentInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface sentimentUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}

// ratios Domain
export interface ratios {
  _id: string
  name: string
  description?: string
  status?: 'active' | 'archived'
  created: Breadcrumb
  saved: Breadcrumb
}

export interface ratiosInput {
  name: string
  description?: string
  status?: 'active' | 'archived'
}

export interface ratiosUpdate {
  name?: string
  description?: string
  status?: 'active' | 'archived'
}



// post Domain
export interface post {
  _id: string
  name: string
  description?: string
  status?: string
}

// comment Domain
export interface comment {
  _id: string
  name: string
  description?: string
  status?: string
}

// user Domain
export interface user {
  _id: string
  name: string
  description?: string
  status?: string
}


// Authentication
export interface DevLoginRequest {
  subject?: string
  roles?: string[]
}

export interface DevLoginResponse {
  access_token: string
  token_type: string
  expires_at: string
  subject: string
  roles: string[]
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
