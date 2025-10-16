export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  accountId: number
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
