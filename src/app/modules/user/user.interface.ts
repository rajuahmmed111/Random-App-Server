export interface CreateUserData {
  email: string
  username: string
  password: string
  avatar?: string
}

export interface UpdateUserData {
  email?: string
  username?: string
  avatar?: string
}

export interface UserResponse {
  id: string
  email: string
  username: string
  avatar?: string | null
  createdAt: Date
}
