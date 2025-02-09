import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CountryService } from 'src/countries/countries.service';
import { DbService } from 'src/db/db.service';
import { RoleService } from 'src/roles/roles.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private db: DbService,
		private roleService: RoleService,
		private countryService: CountryService,
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

		const user = await this.db.user.update({
			where: {
				id: userId,
			},
			data: {
				roles: {
					connect: { id: roleId },
				},
			},
		});

		this.logger.log(`Role added to user: ${JSON.stringify(user)}`);
	}

	async removeRole(userId: number, roleId: number) {
		this.logger.log(
			`Removing role with ID '${roleId}' from user with ID '${userId}'`,
		);

		const user = await this.db.user.update({
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

		this.logger.log(`Role removed: ${JSON.stringify(user)}`);
	}

	async updateConfirmationCode(
		id: number,
		code: string | null,
		codeExpiresAt: Date | null,
	) {
		this.logger.log(`Updating confirmation code from user with ID '${id}'`);

		const user = await this.db.user.update({
			where: {
				id,
			},
			data: {
				confirmationCode: code,
				confirmationCodeExpiresAt: codeExpiresAt,
			},
		});

		this.logger.log(`Confirmation code updated: ${JSON.stringify(user)}`);
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

		const country = await this.countryService.findByCode(countryCode);

		const user = await this.db.user.create({
			data: {
				email,
				hash,
				salt,
				country: {
					connect: {
						code: country.code,
					},
				},
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

		return user;
	}
}
