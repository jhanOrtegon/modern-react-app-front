import { ValidationError } from '@/lib/errors'

import type { CreateUserDto, UpdateUserDto } from '../dtos'

const MAX_NAME_LENGTH = 100
const MAX_USERNAME_LENGTH = 50
const MAX_EMAIL_LENGTH = 100
const MAX_PHONE_LENGTH = 30
const MAX_WEBSITE_LENGTH = 100
const MIN_NAME_LENGTH = 2
const MIN_USERNAME_LENGTH = 3

function validateName(name: string): void {
  const trimmedName = name.trim()

  if (trimmedName.length === 0) {
    throw new ValidationError('El nombre no puede estar vacío', 'name')
  }

  if (trimmedName.length < MIN_NAME_LENGTH) {
    throw new ValidationError(
      `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres`,
      'name'
    )
  }

  if (name.length > MAX_NAME_LENGTH) {
    throw new ValidationError(
      `El nombre no puede exceder ${MAX_NAME_LENGTH} caracteres`,
      'name'
    )
  }
}

function validateUsername(username: string): void {
  const trimmedUsername = username.trim()

  if (trimmedUsername.length === 0) {
    throw new ValidationError('El username no puede estar vacío', 'username')
  }

  if (trimmedUsername.length < MIN_USERNAME_LENGTH) {
    throw new ValidationError(
      `El username debe tener al menos ${MIN_USERNAME_LENGTH} caracteres`,
      'username'
    )
  }

  if (username.length > MAX_USERNAME_LENGTH) {
    throw new ValidationError(
      `El username no puede exceder ${MAX_USERNAME_LENGTH} caracteres`,
      'username'
    )
  }

  const usernameRegex = /^[a-zA-Z0-9-_.]+$/
  if (!usernameRegex.test(username)) {
    throw new ValidationError(
      'El username solo puede contener letras, números, guiones y puntos',
      'username'
    )
  }
}

function validateEmail(email: string): void {
  const trimmedEmail = email.trim()

  if (trimmedEmail.length === 0) {
    throw new ValidationError('El email no puede estar vacío', 'email')
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    throw new ValidationError(
      `El email no puede exceder ${MAX_EMAIL_LENGTH} caracteres`,
      'email'
    )
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new ValidationError('El formato del email no es válido', 'email')
  }
}

function validatePhone(phone: string): void {
  if (phone.length > MAX_PHONE_LENGTH) {
    throw new ValidationError(
      `El teléfono no puede exceder ${MAX_PHONE_LENGTH} caracteres`,
      'phone'
    )
  }
}

function validateWebsite(website: string): void {
  if (website.length > MAX_WEBSITE_LENGTH) {
    throw new ValidationError(
      `El website no puede exceder ${MAX_WEBSITE_LENGTH} caracteres`,
      'website'
    )
  }
}

function validateAccountId(accountId: number): void {
  if (!accountId || accountId <= 0) {
    throw new ValidationError(
      'El accountId debe ser un número mayor a 0',
      'accountId'
    )
  }
}

function validate(user: CreateUserDto | UpdateUserDto): void {
  validateName(user.name)
  validateUsername(user.username)
  validateEmail(user.email)
  validatePhone(user.phone)
  validateWebsite(user.website)
  validateAccountId(user.accountId)
}

export const UserValidator = {
  validate,
  validateName,
  validateUsername,
  validateEmail,
  validatePhone,
  validateWebsite,
  validateAccountId,
}
