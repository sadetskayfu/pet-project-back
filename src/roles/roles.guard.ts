import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DbService } from 'src/db/db.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private db: DbService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем роли, указанные в декораторе @Roles
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true; // Если роли не указаны, доступ разрешен
    }

    // Получаем пользователя из запроса
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Проверяем, есть ли у пользователя необходимая роль
    const userRoles = await this.db.role.findMany({
      where: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    });

    const hasRole = userRoles.some((role) => requiredRoles.includes(role.name));
    if (!hasRole) {
      throw new ForbiddenException('У вас нет доступа к этому ресурсу');
    }

    return true;
  }
}