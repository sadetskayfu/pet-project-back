import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';

@Injectable()
export class ConfirmationCodeService {
	constructor(private configService: ConfigService) {}

	getCode() {
		const code = Math.random().toString(36).substring(2, 8).toUpperCase();

		const now = new Date();

    const authConfig = this.configService.get<AuthConfig>('auth')

    if(!authConfig) {
      throw new Error('Auth config not found')
    }
    
    const codeTimeValid = authConfig.confirmationCodeTimeValid
		const codeExpiresAt = new Date(now.getTime() + codeTimeValid);

		return { code, codeExpiresAt };
	}

	checkOnExpired(codeExpiresAt: Date | null) {
		return new Date() > (codeExpiresAt ? codeExpiresAt : 0);
	}
}
