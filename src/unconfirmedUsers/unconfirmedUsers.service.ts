import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from 'src/config/auth.config';
import { CountryService } from 'src/countries/countries.service';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UnconfirmedUserService {
	private readonly logger = new Logger(UnconfirmedUserService.name);

	constructor(
		private db: DbService,
		private configService: ConfigService,
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

		const authConfig = this.configService.get<AuthConfig>('auth');

		if (!authConfig) {
			throw new Error('Auth config not found');
		}

		const unconfirmedUserTimeLife = authConfig.unconfirmedUserTimeLife;

		const expirationTime = new Date(
			now.getTime() - unconfirmedUserTimeLife,
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
		code: string,
		codeExpiresAt: Date,
	) {
		await this.countryService.findCountryByCode(countryCode)

		this.logger.log(`Creating user with email '${email}'`);

		const user = await this.db.unconfirmedUser.create({
			data: {
				countryCode,
				email,
				hash,
				salt,
				confirmationCode: code,
				confirmationCodeExpiresAt: codeExpiresAt,
			},
		});

		this.logger.log(`User created: ${JSON.stringify(user)}`);

		return user;
	}

	async updateConfirmationCode(
		id: number,
		code: string,
		codeExpiresAt: Date,
	) {
		this.logger.log(`Updating confirmation code for user with ID '${id}'`);

		const user = await this.db.unconfirmedUser.update({
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

	async delete(id: number) {
		this.logger.log(`Deleting user with ID '${id}'`);

		const user = await this.db.unconfirmedUser.delete({
			where: { id },
		});

		this.logger.log(`User deleted: ${JSON.stringify(user)}`);

		return user;
	}
}
