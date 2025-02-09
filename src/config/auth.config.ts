import { registerAs } from '@nestjs/config';

export interface AuthConfig {
    confirmationCodeTimeValid: number
    unconfirmedUserTimeLife: number
    cookieTimeLife: number
}

export default registerAs('auth', (): AuthConfig => ({
  confirmationCodeTimeValid: 3 * 60 * 1000,
  cookieTimeLife: 7 * 24 * 60 * 60 * 1000,
  unconfirmedUserTimeLife: 30 * 60 * 1000,
}));