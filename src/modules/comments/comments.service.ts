import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
	CommentResponse,
	CreateCommentResponse,
	DeleteCommentResponse,
	GetCommentsForReviewResponse,
	PaginationDto,
    UpdateCommentResponse,
} from './dto';
import {
	isRecordNotFoundError,
	isUniqueConstraintError,
} from 'src/shared/helpers/errors/prisma-errors';
import { Prisma } from '@prisma/client';
import { ReviewService } from '../reviews/reviews.service';

type RawComment = Prisma.CommentGetPayload<{
	include: {
		user: {
			select: {
				id: true;
				country: true;
				displayName: true;
				email: true;
				avatarUrl: true;
                totalReviews: true
			};
		};
	};
}>;

@Injectable()
export class CommentService {
	constructor(private db: DbService, private reviewService: ReviewService) {}

	async addLike(userId: number, commentId: number) {
		try {
			await this.db.commentLike.create({
				data: {
					user: { connect: { id: userId } },
					comment: { connect: { id: commentId } },
				},
			});

			const userDislike = await this.db.commentLike.findUnique({
				where: { userId_commentId: { userId, commentId } },
				select: {
					id: true,
				},
			});

			if (userDislike) {
				await this.db.commentDislike.delete({
					where: {
						id: userDislike.id,
					},
				});
			}

			await this.db.comment.update({
				where: {
					id: commentId,
				},
				data: {
					totalLikes: { increment: 1 },
					totalDislikes: userDislike ? { decrement: 1 } : {},
				},
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					`User already has a like for this comment`,
				);
			}

			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or comment does not exist');
			}

			throw error;
		}
	}

	async removeLike(userId: number, commentId: number) {
		try {
			await this.db.commentLike.delete({
				where: { userId_commentId: { userId, commentId } },
				select: {
					id: true,
				},
			});

			await this.db.comment.update({
				where: {
					id: commentId,
				},
				data: {
					totalLikes: { decrement: 1 },
				},
			});
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException(
					`The user doesn't have a like for this comment`,
				);
			}
		}
	}

	async addDislike(userId: number, commentId: number) {
		try {
			await this.db.commentDislike.create({
				data: {
					user: { connect: { id: userId } },
					comment: { connect: { id: commentId } },
				},
				select: {
					id: true,
				},
			});

			const userLike = await this.db.commentLike.findUnique({
				where: { userId_commentId: { userId, commentId } },
				select: {
					id: true,
				},
			});

			if (userLike) {
				await this.db.commentLike.delete({
					where: {
						id: userLike.id,
					},
				});
			}

			await this.db.comment.update({
				where: {
					id: commentId,
				},
				data: {
					totalDislikes: { increment: 1 },
					totalLikes: userLike ? { decrement: 1 } : {},
				},
			});
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					`User already has a dislike for this comment`,
				);
			}

			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or comment does not exist');
			}

			throw error;
		}
	}

	async removeDislike(userId: number, commentId: number) {
		try {
			await this.db.commentDislike.delete({
				where: { userId_commentId: { userId, commentId } },
				select: {
					id: true,
				},
			});

			await this.db.comment.update({
				where: {
					id: commentId,
				},
				data: {
					totalDislikes: { decrement: 1 },
				},
			});
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException(
					`The user doesn't have a dislike for this comment`,
				);
			}
		}
	}

	async toggleLike(userId: number, commentId: number, isLiked: boolean) {
		if (isLiked) {
			return await this.removeLike(userId, commentId);
		} else {
			return await this.addLike(userId, commentId);
		}
	}

	async toggleDislike(
		userId: number,
		commentId: number,
		isDisliked: boolean,
	) {
		if (isDisliked) {
			return await this.removeDislike(userId, commentId);
		} else {
			return await this.addDislike(userId, commentId);
		}
	}

	async findLikedComments(userId: number): Promise<Set<number>> {
		const likedComments = await this.db.comment.findMany({
			where: {
				likes: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const likedCommentIds = likedComments.map((comment) => comment.id);

		return new Set(likedCommentIds);
	}

	async findDislikedComments(userId: number): Promise<Set<number>> {
		const dislikedComments = await this.db.comment.findMany({
			where: {
				dislikes: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const dislikedCommentIds = dislikedComments.map(
			(comment) => comment.id,
		);

		return new Set(dislikedCommentIds);
	}

	async transformComment(
		comment: RawComment,
		userId: number,
	): Promise<CommentResponse> {
		let likedCommentIds: Set<number> = new Set();
		let dislikedCommentIds: Set<number> = new Set();

		[likedCommentIds, dislikedCommentIds] = await Promise.all([
			this.findLikedComments(userId),
			this.findDislikedComments(userId),
		]);

		const transformComment: CommentResponse = {
			...comment,
			isLiked: likedCommentIds.has(comment.id),
			isDisliked: dislikedCommentIds.has(comment.id),
		};

		return transformComment;
	}

	async transformComments(
		comments: RawComment[],
		userId?: number,
	): Promise<CommentResponse[]> {
		let likedCommentIds: Set<number> = new Set();
		let dislikedCommentIds: Set<number> = new Set();

		if (userId) {
			[likedCommentIds, dislikedCommentIds] = await Promise.all([
				this.findLikedComments(userId),
				this.findDislikedComments(userId),
			]);
		}

		const transformedComments: CommentResponse[] = comments.map(
			(comment) => ({
				...comment,
				isLiked: likedCommentIds.has(comment.id),
				isDisliked: dislikedCommentIds.has(comment.id),
			}),
		);

		return transformedComments;
	}

	async getCommentsForReview(
		reviewId: number,
		pagination: PaginationDto,
		userId?: number,
	): Promise<GetCommentsForReviewResponse> {
		const { limit = 10, cursor } = pagination;

		const comments = await this.db.comment.findMany({
			skip: cursor ? 1 : undefined,
			cursor: cursor ? { id: cursor } : undefined,
			take: limit,
			where: {
				reviewId,
			},
			orderBy: { id: 'desc' },
			include: {
				user: {
					select: {
						id: true,
						country: true,
						displayName: true,
						email: true,
						avatarUrl: true,
                        totalReviews: true
					},
				},
			},
		});

		const transformedComments = await this.transformComments(
			comments,
			userId,
		);

		const lastCommentIndex = comments.length - 1;

		const nextCursor: number | null =
			comments.length === limit ? comments[lastCommentIndex].id : null;

		return {
			data: transformedComments,
			nextCursor,
		};
	}

	async findCommentById(id: number) {
		const comment = await this.db.comment.findUnique({
			where: {
				id,
			},
			select: {
				userId: true,
			},
		});

		if (!comment) {
			throw new NotFoundException(
				`Comment does not exist`,
			);
		}

		return comment;
	}

	async createComment(userId: number, reviewId: number, message: string): Promise<CreateCommentResponse> {
        try {
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
                include: {
                    user: {
                        select: {
                            id: true,
                            country: true,
                            displayName: true,
                            email: true,
                            avatarUrl: true,
                            totalReviews: true
                        },
                    },
                },
            });

            const updatedReview =  await this.reviewService.updateTotalComments(reviewId, true)

            return {...comment, isLiked: false, isDisliked: false, review: updatedReview}
        } catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new BadRequestException('User or review does not exist');
			}

			throw error;
        }
	}

	async deleteComment(userId: number, commentId: number): Promise<DeleteCommentResponse> {
		const comment = await this.findCommentById(commentId);

		if (comment.userId !== userId) {
			throw new ForbiddenException(
				`This User cant delete this comment`,
			);
		}

		const deletedComment = await this.db.comment.delete({
			where: {
				id: commentId,
			},
			select: {
				id: true,
                reviewId: true
			},
		});

        const updatedReview =  await this.reviewService.updateTotalComments(deletedComment.reviewId, false)

		return {id: deletedComment.id, review: updatedReview};
	}

	async updateComment(userId: number, commentId: number, message: string): Promise<UpdateCommentResponse> {
		const comment = await this.findCommentById(commentId);

		if (comment.userId !== userId) {
			throw new ForbiddenException(
				`This user cant update this comment`,
			);
		}

		const updatedComment = await this.db.comment.update({
			where: {
				id: commentId,
			},
			data: {
				message,
				isChanged: true,
			},
            select: {
                id: true,
                isChanged: true,
                message: true
            }
		});

		return updatedComment;
	}
}
