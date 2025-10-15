export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface CreateUserDto {
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export interface UpdateUserDto extends CreateUserDto {
  id: number
}
