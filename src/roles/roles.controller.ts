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
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
	constructor(private roleService: RoleService) {}

	@Post()
	@ApiOperation({ summary: 'Добавить роль пользователю' })
	@ApiOkResponse({
		description: 'The user roles have been successfully updated',
	})
	@HttpCode(HttpStatus.OK)
	async addRoleToUserByEmail(@Body() body: UpdateUserRoleBodyDto) {
		return this.roleService.addRoleToUserByEmail(body.email, body.role);
	}

	@Delete()
	@ApiOperation({ summary: 'Удалить роль у пользователя' })
	@ApiOkResponse({
		description: 'The user roles have been successfully updated',
	})
	@HttpCode(HttpStatus.OK)
	async removeRoleFromUserByEmail(@Body() body: UpdateUserRoleBodyDto) {
		return this.roleService.removeRoleFromUserByEmail(
			body.email,
			body.role,
		);
	}
}
