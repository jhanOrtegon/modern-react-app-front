export interface Account {
  id: number
  email: string
  name: string
  createdAt: Date
}

export interface AccountWithPassword extends Account {
  password: string
}
