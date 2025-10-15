export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  accountId: number // ID de la cuenta propietaria
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
  accountId: number
}

export interface UpdateUserDto extends CreateUserDto {
  id: number
}
