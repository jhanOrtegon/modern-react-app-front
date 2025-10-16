export interface UserAPIAddress {
  street?: string
  suite?: string
  city?: string
  zipcode?: string
}

export interface UserAPICompany {
  name?: string
  catchPhrase?: string
  bs?: string
}

export interface UserAPIResponse {
  id?: number
  name?: string
  username?: string
  email?: string
  phone?: string
  website?: string
  address?: UserAPIAddress
  company?: UserAPICompany
}

export interface UserAPICreateRequest {
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export interface UserAPIUpdateRequest {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}
