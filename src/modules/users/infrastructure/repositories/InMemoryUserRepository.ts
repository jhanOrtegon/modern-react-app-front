import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

export class InMemoryUserRepository implements IUserRepository {
  private users: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      username: 'alicej',
      email: 'alice.johnson@example.com',
      phone: '555-0101',
      website: 'alicejohnson.dev',
      address: {
        street: '123 Main St',
        suite: 'Apt. 4B',
        city: 'New York',
        zipcode: '10001',
      },
      company: {
        name: 'Tech Innovations Inc',
        catchPhrase: 'Innovating the future',
        bs: 'cutting-edge technology solutions',
      },
    },
    {
      id: 2,
      name: 'Bob Smith',
      username: 'bobsmith',
      email: 'bob.smith@example.com',
      phone: '555-0102',
      website: 'bobsmith.io',
      address: {
        street: '456 Oak Ave',
        suite: 'Suite 200',
        city: 'San Francisco',
        zipcode: '94102',
      },
      company: {
        name: 'Digital Dreams LLC',
        catchPhrase: 'Dream big, code bigger',
        bs: 'revolutionary digital experiences',
      },
    },
    {
      id: 3,
      name: 'Carol Williams',
      username: 'carolw',
      email: 'carol.williams@example.com',
      phone: '555-0103',
      website: 'carolwilliams.com',
      address: {
        street: '789 Pine Rd',
        suite: 'Floor 3',
        city: 'Seattle',
        zipcode: '98101',
      },
      company: {
        name: 'Cloud Systems Corp',
        catchPhrase: 'Reach for the cloud',
        bs: 'scalable cloud infrastructure',
      },
    },
    {
      id: 4,
      name: 'David Brown',
      username: 'davidb',
      email: 'david.brown@example.com',
      phone: '555-0104',
      website: 'davidbrown.net',
      address: {
        street: '321 Elm St',
        suite: 'Unit 12',
        city: 'Austin',
        zipcode: '73301',
      },
      company: {
        name: 'Data Dynamics',
        catchPhrase: 'Data-driven decisions',
        bs: 'advanced analytics platforms',
      },
    },
    {
      id: 5,
      name: 'Emma Davis',
      username: 'emmad',
      email: 'emma.davis@example.com',
      phone: '555-0105',
      website: 'emmadavis.co',
      address: {
        street: '654 Maple Dr',
        suite: 'Office 5A',
        city: 'Boston',
        zipcode: '02101',
      },
      company: {
        name: 'Quantum Solutions',
        catchPhrase: 'Quantum leap in tech',
        bs: 'next-generation quantum computing',
      },
    },
  ]

  private nextId = 6

  findAll = async (): Promise<User[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.users]
  }

  findById = async (id: number): Promise<User | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const user = this.users.find(u => u.id === id)
    return user ?? null
  }

  create = async (userDto: CreateUserDto): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))

    const newUser: User = {
      id: this.nextId++,
      ...userDto,
      address: {
        street: 'N/A',
        suite: 'N/A',
        city: 'N/A',
        zipcode: 'N/A',
      },
      company: {
        name: 'N/A',
        catchPhrase: 'N/A',
        bs: 'N/A',
      },
    }

    this.users.push(newUser)
    return newUser
  }

  update = async (userDto: UpdateUserDto): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400))

    const index = this.users.findIndex(u => u.id === userDto.id)

    if (index === -1) {
      throw new Error(`User with id ${String(userDto.id)} not found`)
    }

    const existingUser = this.users[index]
    if (existingUser === undefined) {
      throw new Error(`User with id ${String(userDto.id)} not found`)
    }

    const updatedUser: User = {
      id: existingUser.id,
      name: userDto.name,
      username: userDto.username,
      email: userDto.email,
      phone: userDto.phone,
      website: userDto.website,
      address: existingUser.address,
      company: existingUser.company,
    }

    this.users[index] = updatedUser
    return updatedUser
  }

  delete = async (id: number): Promise<void> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))

    const initialLength = this.users.length
    this.users = this.users.filter(u => u.id !== id)

    if (this.users.length === initialLength) {
      throw new Error(`User with id ${String(id)} not found`)
    }
  }
}
