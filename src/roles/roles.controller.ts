import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { UpdateUserRoleBodyDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
	constructor(private roleService: RoleService) {}

	@Post()
	@ApiOperation({ summary: 'Добавить роль пользователю' })
	@HttpCode(HttpStatus.OK)
	async addRoleToUser(@Body() body: UpdateUserRoleBodyDto) {
		return this.roleService.addRoleToUser(body.email, body.role);
	}

	@Delete()
	@ApiOperation({ summary: 'Удалить роль у пользователя' })
	@HttpCode(HttpStatus.OK)
	async removeRoleFromUser(@Body() body: UpdateUserRoleBodyDto) {
		return this.roleService.removeRoleFromUser(
			body.email,
			body.role,
		);
	}
}
