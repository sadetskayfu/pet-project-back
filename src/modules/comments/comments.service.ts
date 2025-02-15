import {
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CommentResponse } from './dto';
import { CommentLikeService } from 'src/modules/commentLikes/commentLikes.service';
import { ReviewService } from 'src/modules/reviews/reviews.service';

@Injectable()
export class CommentService {
    private readonly logger = new Logger(CommentService.name);

    constructor(
        private db: DbService,
        private likeService: CommentLikeService,
        private reviewService: ReviewService
    ) {}

    async findCommentById(id: number) {
        this.logger.log(`Finding comment by ID '${id}'`);

        const comment = await this.db.comment.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                userId: true,
                reviewId: true,
            }
        });

        this.logger.log(`Found comment: ${JSON.stringify(comment)}`);

        if (!comment) {
            throw new NotFoundException(
                `Comment with ID '${id}' does not exist`,
            );
        }

        return comment;
    }

    async getCommentsForReview(
        reviewId: number,
        limit: number = 10,
        cursor?: number,
        orderBy: 'desc' | 'asc' = 'desc',
        userId?: number,
    ) {
        this.logger.log(`Getting comments for review with ID '${reviewId}'`);

        const comments = await this.db.comment.findMany({
            skip: cursor ? 1 : undefined,
            cursor: cursor ? { id: cursor } : undefined,
            take: limit,
            where: {
                reviewId,
            },
            orderBy: {
                id: orderBy,
            },
        });

        let commentWithLikes: CommentResponse[] = []

        if (userId) {
            const commentIds = comments.map((comment) => comment.id);

            const likedComments = await this.likeService.findLikedComments(
                userId,
                commentIds,
            );

            const likedCommentIds = new Set(
                likedComments.map((like) => like.commentId),
            );

            commentWithLikes = comments.map((comment) => ({
                ...comment,
                isLiked: likedCommentIds.has(comment.id),
            }));
        } else {
            commentWithLikes = comments.map((comment) => ({
                ...comment,
                isLiked: false
            }))
        }

        const nextCursor =
            comments.length === limit ? comments[comments.length - 1].id : null;

        this.logger.log(`Found comments: ${JSON.stringify(commentWithLikes)}`);

        return {
            comments: commentWithLikes,
            nextCursor,
        };
    }

    async createComment(
        userId: number,
        reviewId: number,
        message: string,
    ) {
        this.logger.log(`Creating comment to review with ID '${reviewId}'`);

        const comment = await this.db.comment.create({
            data: {
                message,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                review: {
                    connect: {
                        id: reviewId,
                    },
                },
            },
        });

        const commentWithLike = {
            ...comment,
            isLiked: false
        }

        this.logger.log(`Comment created: ${JSON.stringify(commentWithLike)}`);

        await this.reviewService.updateTotalComments(reviewId, true)

        return commentWithLike;
    }

    async deleteComment(userId: number, commentId: number) {
        const comment = await this.findCommentById(commentId);

        if (comment.userId !== userId) {
            throw new ForbiddenException(
                `User with ID '${userId}' cant delete comment with ID '${commentId}' `,
            );
        }

        this.logger.log(`Deleting comment with ID ${commentId}`);

        const deletedComment = await this.db.comment.delete({
            where: {
                id: commentId,
            },
            select: {
                id: true
            }
        });

        this.logger.log(`Comment deleted: ${JSON.stringify(deletedComment)}`);

        await this.reviewService.updateTotalComments(comment.reviewId, false)

        return deletedComment;
    }

    async updateComment(
        userId: number,
        commentId: number,
        message: string,
    ) {
        const comment = await this.findCommentById(commentId);

        if (comment.userId !== userId) {
            throw new ForbiddenException(
                `User with ID '${userId}' cant delete comment with ID '${commentId}' `,
            );
        }

        this.logger.log(`Updating comment by ID '${commentId}'`);

        const updatedComment = await this.db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                message,
                isChanged: true,
            },
        });

        const userLike = await this.likeService.findUserLike(userId, commentId)

        const updatedCommentWithLike = {
            ...updatedComment,
            isLiked: !!userLike
        }

        this.logger.log(`Comment updated: ${JSON.stringify(updatedCommentWithLike)}`);

        return updatedCommentWithLike;
    }

    async updateTotalLikes(commentId: number, isIncrement: boolean) {
        this.logger.log(
            `Updating total likes for comment with ID '${commentId}'`,
        );

        const updatedComment = await this.db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                totalLikes: isIncrement ? { increment: 1 } : { decrement: 1 },
            },
            select: {
                id: true,
                totalLikes: true
            }
        });

        this.logger.log(`Comment updated: ${JSON.stringify(updatedComment)}`);

        return updatedComment;
    }

    async toggleUserLike(userId: number, commentId: number) {
        await this.findCommentById(commentId);

        const userLike = await this.likeService.findUserLike(userId, commentId);

        if (userLike) {
            await this.likeService.removeLike(userId, commentId);

            const updatedComment = await this.updateTotalLikes(commentId, false);

            return {
                ...updatedComment,
                isLiked: false
            }
        } else {
            await this.likeService.addLike(userId, commentId);

            const updatedComment = await this.updateTotalLikes(commentId, true);

            return {
                ...updatedComment,
                isLiked: true
            }
        }
    }
}
