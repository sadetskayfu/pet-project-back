import { Injectable, Logger } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class CommentLikeService {
    private readonly logger = new Logger(CommentLikeService.name);

    constructor(private db: DbService){}

    async findUserLike(userId: number, commentId: number) {
        this.logger.log(`Finding user like in comment with ID '${commentId}'`)

        const like = await this.db.commentLike.findUnique({
            where: {
                userId,
                commentId
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Found user like: ${JSON.stringify(like)}`)

        return like
    }

    async findLikedComments(userId: number, commentIds: number[]) {
        this.logger.log(`Finding liked comments`)

        const likedComments = await this.db.commentLike.findMany({
            where: {
                userId,
                commentId: { in: commentIds }
            },
            select: {
                commentId: true
            }
        })

        this.logger.log(`Found liked comments: ${JSON.stringify(likedComments)}`)

        return likedComments
    }

    async addLike(userId: number, commentId: number) {
        this.logger.log(`Adding like to comment with ID '${commentId}'`)

        const like = await this.db.commentLike.create({
            data: {
                userId,
                commentId
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Like added: ${JSON.stringify(like)}`)

        return like
    }

    async removeLike(userId: number, commentId: number) {
        this.logger.log(`Removing like from comment with ID '${commentId}'`)

        const removedLike = await this.db.commentLike.delete({
            where: {
                userId,
                commentId
            },
            select: {
                id: true
            }
        })

        this.logger.log(`Like removed: ${JSON.stringify(removedLike)}`)

        return removedLike
    }
}