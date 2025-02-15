import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CountryService } from 'src/modules/countries/countries.service';
import { DbService } from 'src/db/db.service';
import { ProfileService } from 'src/modules/profile/profile.service';
import { RoleService } from 'src/modules/roles/roles.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private db: DbService,
		private roleService: RoleService,
		private profileService: ProfileService
	) {}

	async findByEmail(email: string) {
		this.logger.log(`Finding user by email '${email}'`);

		const user = await this.db.user.findFirst({
			where: { email },
			include: { roles: true },
		});

		this.logger.log(`Found user: ${JSON.stringify(user)}`);

		return user;
	}

	async findById(id: number) {
		this.logger.log(`Finding user by ID '${id}'`);

		const user = await this.db.user.findUnique({
			where: {
				id,
			},
			include: {
				roles: true,
			},
		});

		this.logger.log(`Found user: ${JSON.stringify(user)}`);

		return user;
	}

	async addRole(userId: number, roleId: number) {
		this.logger.log(
			`Adding role with ID '${roleId}' to user with ID '${userId}'`,
		);

		await this.db.user.update({
			where: {
				id: userId,
			},
			data: {
				roles: {
					connect: { id: roleId },
				},
			},
		});

		this.logger.log(`Role with id '${roleId}' added to user with id '${userId}'`);
	}

	async removeRole(userId: number, roleId: number) {
		this.logger.log(
			`Removing role with id '${roleId}' from user with id '${userId}'`,
		);

		await this.db.user.update({
			where: {
				id: userId,
			},
			data: {
				roles: {
					disconnect: {
						id: roleId,
					},
				},
			},
		});

		this.logger.log(`Role with id '${roleId}' removed from user with id '${userId}'`);
	}

	async create(
		email: string,
		hash: string,
		salt: string,
		countryCode: string,
	) {
		this.logger.log(`Creating user with email '${email}'`);

		const role = await this.roleService.findByName('user');

		if (!role) {
			throw new NotFoundException(`Role 'user' does not exist`);
		}

		const user = await this.db.user.create({
			data: {
				email,
				hash,
				salt,
				countryCode,
				roles: {
					connect: {
						id: role.id,
					},
				},
			},
			include: {
				roles: true,
			},
		});

		this.logger.log(`User created: ${JSON.stringify(user)}`);

		await this.profileService.createProfile(user.id)

		return user;
	}
}
