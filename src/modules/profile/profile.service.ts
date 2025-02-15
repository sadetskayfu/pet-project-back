import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UpdateProfileDto } from "./dto";

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    constructor(private db: DbService){}

    async findProfileByUserId(userId: number) {
        this.logger.log(`Finding profile for user with ID '${userId}'`)

        const profile = await this.db.profile.create({
            data: {
                userId
            },
        })

        this.logger.log(`Found profile: ${JSON.stringify(profile)}`)

        if(!profile) {
            throw new NotFoundException(`Profile for user with ID '${userId}' not found`)
        }

        return profile
    }

    async createProfile(userId: number) {
        this.logger.log(`Creating profile for user with ID '${userId}'`)

        const profile = await this.db.profile.create({
            data: {
                userId
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Profile created: ${JSON.stringify(profile)}`)

        return profile
    }

    async updateProfile(userId: number, body: UpdateProfileDto) {
        await this.findProfileByUserId(userId)

        this.logger.log(`Updating profile for user with ID '${userId}'`)

        const updatedProfile = await this.db.profile.update({
            where: {
                userId,
            },
            data: {
                ...body
            }
        })

        this.logger.log(`Profile updated: ${JSON.stringify(updatedProfile)}`)

        return updatedProfile
    }
}