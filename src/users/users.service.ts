import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
	constructor(private db: DbService) {}

	async findByEmail(email: string) {
		return await this.db.user.findFirst({ where: { email } });
	}

	async create(
		email: string,
		hash: string,
		salt: string,
		countryCode: string,
	) {
		const newUser = await this.db.user.create({
			data: {
				email,
				hash,
				salt,
				country: {
					connect: {
						code: countryCode,
					},
				},
			},
		});

		return newUser;
	}
}
