import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
	constructor(private db: DbService) {}

	async findByEmail(email: string) {
		return this.db.user.findFirst({
			where: { email },
			include: { roles: true },
		});
	}

	async findById(id: number) {
		return this.db.user.findUnique({
			where: {
				id
			}
		})
	}

	async addRole(userId: number, roleId: number) {
		return this.db.user.update({
			where: {
				id: userId,
			},
			data: {
				roles: {
					connect: { id: roleId },
				},
			},
		});
	}

	async removeRole(userId: number, roleId: number) {
		return this.db.user.update({
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
	}

	async updateConfirmationCode(id: number, code: string) {
        this.db.unconfirmedUser.update({
            where: {
                id
            },
            data: {
                confirmationCode: code
            }
        })
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
