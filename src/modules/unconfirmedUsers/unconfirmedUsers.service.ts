import { Injectable, Logger } from '@nestjs/common';
import { CountryService } from 'src/modules/countries/countries.service';
import { DbService } from 'src/db/db.service';
import { UNCONFIRMED_USER_TIME_LIFE } from 'src/shared/constants';

@Injectable()
export class UnconfirmedUserService {
	private readonly logger = new Logger(UnconfirmedUserService.name);

	constructor(
		private db: DbService,
		private countryService: CountryService
	) {}

	async findByEmail(email: string) {
		this.logger.log(`Finding user by email '${email}'`);

		const user = await this.db.unconfirmedUser.findUnique({
			where: {
				email,
			},
		});

		this.logger.log(`Found user: ${JSON.stringify(user)}`);

		return user;
	}

	async findById(id: number) {
		this.logger.log(`Finding user by ID '${id}'`);

		const user = await this.db.unconfirmedUser.findUnique({
			where: {
				id,
			},
		});

		this.logger.log(`Found user: ${JSON.stringify(user)}`);

		return user;
	}

	async deleteExpiredUsers() {
		const now = new Date();

		const expirationTime = new Date(
			now.getTime() - UNCONFIRMED_USER_TIME_LIFE,
		);

		this.logger.log(`Deleting users created before: ${expirationTime}`);

		const deletedUsers = await this.db.unconfirmedUser.deleteMany({
			where: {
				createdAt: {
					lt: expirationTime,
				},
			},
		});

		this.logger.log(`Deleted ${deletedUsers.count} expired users`);
	}

	async create(
		email: string,
		hash: string,
		salt: string,
		countryCode: string,
	) {
		await this.countryService.findCountryByCode(countryCode)

		this.logger.log(`Creating user with email '${email}'`);

		const user = await this.db.unconfirmedUser.create({
			data: {
				countryCode,
				email,
				hash,
				salt,
			},
			select: {
				id: true
			}
		});

		this.logger.log(`User created: ${JSON.stringify(user)}`);

		return user;
	}

	async delete(id: number) {
		this.logger.log(`Deleting user with ID '${id}'`);

		await this.db.unconfirmedUser.delete({
			where: { id },
		});

		this.logger.log(`User deleted`);
	}
}
