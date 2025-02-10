import { Injectable, Logger } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class ReviewLikeService {
    private readonly logger = new Logger(ReviewLikeService.name);

    constructor(private db: DbService){}

    async addLike(userId: number, reviewId: number) {
        this.logger.log(`Adding like to review with ID '${reviewId}'`)

        const like = await this.db.reviewLike.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                review: {
                    connect: {
                        id: reviewId
                    }
                }
            }
        })

        this.logger.log(`Like added: ${JSON.stringify(like)}`)

        return like
    }

    async removeLike(userId: number, reviewId: number) {
        this.logger.log(`Removing like from review with ID '${reviewId}'`)

        const removedLike = await this.db.reviewLike.delete({
            where: {
                userId,
                reviewId
            }
        })

        this.logger.log(`Like removed: ${JSON.stringify(removedLike)}`)

        return removedLike
    }
}