import { DbService } from 'src/db/db.service';
import { UserService } from 'src/modules/users/users.service';
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

@Injectable()
export class RoleService {
	private readonly logger = new Logger(RoleService.name);

	constructor(
		private db: DbService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {}

	async findByName(name: string) {
		this.logger.log(`Finding role by name '${name}'`);

		const role = await this.db.role.findUnique({
			where: {
				name,
			},
		});

		this.logger.log(`Found role: ${JSON.stringify(role)}`);

		return role;
	}

	async addRoleToUser(email: string, newRole: string) {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new NotFoundException(
				`User with email '${email}' was not found`,
			);
		}

		const role = await this.findByName(newRole);

		if (!role) {
			throw new NotFoundException(`Role '${newRole}' does not exist`);
		}

		if (user.roles.find((userRole) => userRole.name === role.name)) {
			throw new BadRequestException(
				`User already has the role '${role}'`,
			);
		}

		await this.userService.addRole(user.id, role.id);

		return {
			message: `Role '${newRole}' successfully assigned to user '${email}'`,
		};
	}

	async removeRoleFromUser(email: string, roleToRemove: string) {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new NotFoundException(
				`User with email '${email}' was not found`,
			);
		}

		const role = await this.findByName(roleToRemove);

		if (!role) {
			throw new NotFoundException(
				`Role '${roleToRemove}' does not exist`,
			);
		}

		if (!(user.roles.find((userRole) => userRole.name === role.name))) {
			throw new BadRequestException(
				`User does not have role '${role}'`,
			);
		}

		await this.userService.removeRole(user.id, role.id);

		return {
			message: `Role '${roleToRemove}' successfully removed from user '${email}'`,
		};
	}
}
