import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
	constructor(private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest() as Request;
		const token = request.cookies[CookieService.tokenKey];

		if (!token) {
			return true;
		}

		try {
			const sessionInfo = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			});
			request['session'] = sessionInfo;
			return true;
		} catch {
			return true;
		}
	}
}
