import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from '@nestjs/common';
import { RoleService } from './roles.service';
import { RoleResponse, UpdateUserRoleBodyDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/roles.decorator';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
	constructor(private roleService: RoleService) {}

	@Post()
	@ApiOperation({ summary: 'Добавить роль пользователю' })
	@ApiResponse({
		status: 200,
		type: RoleResponse
	})
	@HttpCode(HttpStatus.OK)
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async addRoleToUser(@Body() body: UpdateUserRoleBodyDto): Promise<RoleResponse> {
		return this.roleService.addRoleToUser(body.email, body.role);
	}

	@Delete()
	@ApiResponse({
		status: 200,
		type: RoleResponse
	})
	@ApiOperation({ summary: 'Удалить роль у пользователя' })
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async removeRoleFromUser(@Body() body: UpdateUserRoleBodyDto): Promise<RoleResponse> {
		return this.roleService.removeRoleFromUser(
			body.email,
			body.role,
		);
	}
}
