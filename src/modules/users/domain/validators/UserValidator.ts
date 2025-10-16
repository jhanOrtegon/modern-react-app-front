import { ValidationError } from '@/lib/errors'

import type { CreateUserDto, UpdateUserDto } from '../dtos'

/**
 * Reglas de validación de negocio para Users
 *
 * Esta clase contiene todas las validaciones relacionadas con la entidad User,
 * separada de la definición de la entidad para mejor organización y mantenibilidad.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class UserValidator {
  private static readonly MAX_NAME_LENGTH = 100
  private static readonly MAX_USERNAME_LENGTH = 50
  private static readonly MAX_EMAIL_LENGTH = 100
  private static readonly MAX_PHONE_LENGTH = 30
  private static readonly MAX_WEBSITE_LENGTH = 100
  private static readonly MIN_NAME_LENGTH = 2
  private static readonly MIN_USERNAME_LENGTH = 3

  /**
   * Valida un user completo
   */
  static validate(user: CreateUserDto | UpdateUserDto): void {
    this.validateName(user.name)
    this.validateUsername(user.username)
    this.validateEmail(user.email)
    this.validatePhone(user.phone)
    this.validateWebsite(user.website)
    this.validateAccountId(user.accountId)
  }

  /**
   * Valida el nombre del usuario
   */
  static validateName(name: string): void {
    const trimmedName = name.trim()

    if (trimmedName.length === 0) {
      throw new ValidationError('El nombre no puede estar vacío', 'name')
    }

    if (trimmedName.length < this.MIN_NAME_LENGTH) {
      throw new ValidationError(
        `El nombre debe tener al menos ${this.MIN_NAME_LENGTH} caracteres`,
        'name'
      )
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      throw new ValidationError(
        `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`,
        'name'
      )
    }
  }

  /**
   * Valida el username
   */
  static validateUsername(username: string): void {
    const trimmedUsername = username.trim()

    if (trimmedUsername.length === 0) {
      throw new ValidationError('El username no puede estar vacío', 'username')
    }

    if (trimmedUsername.length < this.MIN_USERNAME_LENGTH) {
      throw new ValidationError(
        `El username debe tener al menos ${this.MIN_USERNAME_LENGTH} caracteres`,
        'username'
      )
    }

    if (username.length > this.MAX_USERNAME_LENGTH) {
      throw new ValidationError(
        `El username no puede exceder ${this.MAX_USERNAME_LENGTH} caracteres`,
        'username'
      )
    }

    // Validar formato (solo alfanuméricos y guiones)
    const usernameRegex = /^[a-zA-Z0-9-_.]+$/
    if (!usernameRegex.test(username)) {
      throw new ValidationError(
        'El username solo puede contener letras, números, guiones y puntos',
        'username'
      )
    }
  }

  /**
   * Valida el email
   */
  static validateEmail(email: string): void {
    const trimmedEmail = email.trim()

    if (trimmedEmail.length === 0) {
      throw new ValidationError('El email no puede estar vacío', 'email')
    }

    if (email.length > this.MAX_EMAIL_LENGTH) {
      throw new ValidationError(
        `El email no puede exceder ${this.MAX_EMAIL_LENGTH} caracteres`,
        'email'
      )
    }

    // Validar formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ValidationError('El formato del email no es válido', 'email')
    }
  }

  /**
   * Valida el teléfono
   */
  static validatePhone(phone: string): void {
    if (phone.length > this.MAX_PHONE_LENGTH) {
      throw new ValidationError(
        `El teléfono no puede exceder ${this.MAX_PHONE_LENGTH} caracteres`,
        'phone'
      )
    }
  }

  /**
   * Valida el website
   */
  static validateWebsite(website: string): void {
    if (website.length > this.MAX_WEBSITE_LENGTH) {
      throw new ValidationError(
        `El website no puede exceder ${this.MAX_WEBSITE_LENGTH} caracteres`,
        'website'
      )
    }
  }

  /**
   * Valida el accountId
   */
  static validateAccountId(accountId: number): void {
    if (!accountId || accountId <= 0) {
      throw new ValidationError(
        'El accountId debe ser un número mayor a 0',
        'accountId'
      )
    }
  }
}
