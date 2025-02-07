import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';
import { SessionInfo } from './types';

@Injectable()
export class ConfirmationAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest() as Request;
		const token = request.cookies[CookieService.tokenKey];

		if (!token) {
			throw new UnauthorizedException();
		}

		try {
			const sessionInfo: SessionInfo = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});

			if(sessionInfo.isConfirmed) {
				throw new Error
			}
			
			request['session'] = sessionInfo;
		} catch {
			throw new UnauthorizedException();
		}

		return true;
	}
}
