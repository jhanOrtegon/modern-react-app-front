import type { CreateUserDto } from './CreateUserDto'

export interface UpdateUserDto extends CreateUserDto {
  id: number
}
