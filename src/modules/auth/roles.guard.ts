import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { SessionInfoDto } from './dto';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
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
		const sessionInfo = request['session'] as SessionInfoDto | undefined

		if(!sessionInfo) {
			return false
		}

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
