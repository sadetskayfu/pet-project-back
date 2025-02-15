import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { CookieService } from 'src/modules/auth/cookie.service';
import { Request } from 'express';
import { SessionInfoDto } from './dto';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.get<string[]>(
			'roles',
			context.getHandler(),
		);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest() as Request;
		const token = request.cookies[CookieService.tokenKey];

		const sessionInfo: SessionInfoDto = this.jwtService.verify(token, {
			secret: process.env.JWT_SECRET,
		});
		const userRoles = sessionInfo.roles;
		const hasRole = userRoles.some((role) =>
			requiredRoles.includes(role.name),
		);

		if (!hasRole) {
			throw new ForbiddenException("You don't have access to this resource");
		}

		return true;
	}
}
