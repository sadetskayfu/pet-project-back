import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RoleService } from 'src/modules/roles/roles.service';
import { UNCONFIRMED_USER_TIME_LIFE } from 'src/shared/constants';
import { ConfirmationService } from '../confirmation/confirmation.service';

@Injectable()
export class UserService {
	private readonly logger = new Logger(UserService.name);

	constructor(
		private db: DbService,
		private roleService: RoleService,
		private confirmationService: ConfirmationService
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
				roles: {
					connect: {
						id: role.id,
					},
				},
				country: {
					connect: {
						code: countryCode
					}
				}
			},
			include: {
				roles: true,
			},
		});

		this.logger.log(`User created: ${JSON.stringify(user)}`);

		return user;
	}

	async deleteExpiredUnconfirmedUsers() {
		const now = new Date();

		const expirationTime = new Date(
			now.getTime() - UNCONFIRMED_USER_TIME_LIFE,
		);

		this.logger.log(`Deleting users created before: ${expirationTime}`);

		await this.confirmationService.deleteExpiredConfirmationSession()

		const deletedUsers = await this.db.user.deleteMany({
			where: {
				createdAt: {
					lt: expirationTime,
				},
				isConfirmed: false,
			},
		});

		this.logger.log(`Deleted ${deletedUsers.count} expired users`);
	}

	async setConfirmed(id: number) {
		this.logger.log(`Setting confirmed status for user with id '${id}'`);

		await this.db.user.update({
			where: { id },
			data: {
				isConfirmed: true
			}
		});

		this.logger.log(`Confirmed status has been established`);
	}

	async delete(id: number) {
		this.logger.log(`Deleting user with id '${id}'`);

		await this.confirmationService.deleteConfirmationSessionsByUserId(id)

		await this.db.user.delete({
			where: { id },
		});

		this.logger.log(`User deleted`);
	}

	async updateTotalReviews(userId: number, isIncrement: boolean) {
		const updatedUser = await this.db.user.update({
			where: {
				id: userId
			},
			data: {
				totalReviews: isIncrement ? { increment: 1 } : { decrement: 1 }
			},
			select: {
				id: true,
				totalReviews: true,
			}
		})

		return updatedUser
	}

	async getUserAvatar(userId?: number) {
		if(!userId) return null

		const user = await this.db.user.findUnique({
			where: {
				id: userId
			},
			select: {
				avatarUrl: true
			}
		})

		if(!user) {
			throw new NotFoundException('Пользователя с таким id не существуют')
		}

		return user.avatarUrl || ''
	}
}
