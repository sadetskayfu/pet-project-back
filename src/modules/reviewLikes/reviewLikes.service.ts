import { Injectable, Logger } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class ReviewLikeService {
    private readonly logger = new Logger(ReviewLikeService.name);

    constructor(private db: DbService){}

    async findUserLike(userId: number, reviewId: number) {
        this.logger.log(`Finding user like in review with ID '${reviewId}'`)

        const like = await this.db.reviewLike.findUnique({
            where: {
                userId,
                reviewId
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Found user like: ${JSON.stringify(like)}`)

        return like
    }

    async findLikedReviews(userId: number, reviewIds: number[]) {
        this.logger.log(`Finding liked reviews`)

        const likedReviews = await this.db.reviewLike.findMany({
            where: {
                userId,
                reviewId: { in: reviewIds }
            },
            select: {
                reviewId: true
            }
        })

        this.logger.log(`Found liked reviews: ${JSON.stringify(likedReviews)}`)

        return likedReviews
    }

    async addLike(userId: number, reviewId: number) {
        this.logger.log(`Adding like to review with ID '${reviewId}'`)

        const like = await this.db.reviewLike.create({
            data: {
                userId,
                reviewId
            },
            select: {
                id: true
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
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Like removed: ${JSON.stringify(removedLike)}`)

        return removedLike
    }
}