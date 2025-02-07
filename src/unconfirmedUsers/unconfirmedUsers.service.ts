import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class UnconfirmedUserService {
    constructor(private db: DbService){}

    async findByEmail(email: string) {
        return this.db.unconfirmedUser.findUnique({
            where: {
                email
            }
        })
    }

    async findById(id: number) {
        return this.db.unconfirmedUser.findUnique({
            where: {
                id
            }
        })
    }

    async create(email: string, hash: string, salt: string, country: string, code: string) {
        return this.db.unconfirmedUser.create({
            data: {
                country,
                email,
                hash,
                salt,
                confirmationCode: code
            }
        })
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

    async delete(id: number) {
        return this.db.unconfirmedUser.delete({
            where: {
                id
            }
        })
    }
}