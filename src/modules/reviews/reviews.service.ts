import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MovieService } from 'src/modules/movies/movies.service';
import {
	ReviewResponse,
	ReviewFilterDto,
	ReviewSortingDto,
	ReviewPaginationDto,
	ReviewCardForMovieResponse,
	ReviewCardResponse,
	ReviewCursorResponse,
	GetReviewsForMovieResponse,
	DeleteReviewResponse,
	UpdateReviewResponse,
	CreateReviewResponse,
	UpdateReviewTotalCommentsResponse,
} from './dto';
import {
	isRecordNotFoundError,
	isUniqueConstraintError,
} from 'src/shared/helpers/errors/prisma-errors';
import { Prisma } from '@prisma/client';
import { UserService } from '../users/users.service';

function createUserSelect() {
	return {
		user: {
			select: {
				id: true,
				country: true,
				displayName: true,
				email: true,
				avatarUrl: true,
				totalReviews: true
			}
		},
	} satisfies Prisma.ReviewSelect;
}

function createReviewCardSelect() {
	return {
		id: true,
		message: true,
		rating: true,
		createdAt: true,
		userId: true,
		totalLikes: true,
		user: {
			select: {
				id: true,
				email: true,
				displayName: true,
				avatarUrl: true,
				country: true,
				totalReviews: true
			}
		}
	} satisfies Prisma.ReviewSelect;
}
  
const userSelect = createUserSelect()
const reviewCardSelect = createReviewCardSelect()

type RawReview = Prisma.ReviewGetPayload<{
	include: typeof userSelect
}>;

@Injectable()
export class ReviewService {
	constructor(
		private db: DbService,
		private movieService: MovieService,
		private userService: UserService
	) {}

	async findReviewById(id: number) {
		const review = await this.db.review.findUnique({
			where: {
				id
			},
			select: {
				userId: true,
				rating: true
			}
		})

		if(!review) {
			throw new NotFoundException('Review does not exist')
		}

		return review
	}

	async addLike(userId: number, reviewId: number) {
		try {
			await this.db.reviewLike.create({
				data: {
					user: { connect: { id: userId } },
					review: { connect: { id: reviewId } },
				},
			});

			const userDislike = await this.db.reviewDislike.findUnique({
				where: { userId_reviewId: { userId, reviewId } },
				select: {
					id: true,
				},
			});

			if (userDislike) {
				await this.db.reviewDislike.delete({
					where: {
						id: userDislike.id,
					},
				});
			}

			await this.db.review.update({
				where: {
					id: reviewId,
				},
				data: {
					totalLikes: { increment: 1 },
					totalDislikes: userDislike ? { decrement: 1 } : undefined,
				},
			});

			return {id: 2}

		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					`User already has a like for this review`,
				);
			}

			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or review does not exist');
			}

			throw error;
		}
	}

	async removeLike(userId: number, reviewId: number) {
		try {
			await this.db.reviewLike.delete({
				where: { userId_reviewId: { userId, reviewId } },
			});

			await this.db.review.update({
				where: {
					id: reviewId,
				},
				data: {
					totalLikes: { decrement: 1 },
				},
			});

			return {id: 2}
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException(
					`The user doesn't have a like for this review`,
				);
			}
		}
	}

	async addDislike(userId: number, reviewId: number) {
		try {
			await this.db.reviewDislike.create({
				data: {
					user: { connect: { id: userId } },
					review: { connect: { id: reviewId } },
				},
			});

			const userLike = await this.db.reviewLike.findUnique({
				where: { userId_reviewId: { userId, reviewId } },
				select: {
					id: true,
				},
			});

			if (userLike) {
				await this.db.reviewLike.delete({
					where: {
						id: userLike.id,
					},
				});
			}

			await this.db.review.update({
				where: {
					id: reviewId,
				},
				data: {
					totalDislikes: { increment: 1 },
					totalLikes: userLike ? { decrement: 1 } : undefined,
				},
			});

			return {id: 2}
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					`User already has a dislike for this review`,
				);
			}

			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or review does not exist');
			}

			throw error;
		}
	}

	async removeDislike(userId: number, reviewId: number) {
		try {
			await this.db.reviewDislike.delete({
				where: { userId_reviewId: { userId, reviewId } },
				select: {
					id: true,
				},
			});

			await this.db.review.update({
				where: {
					id: reviewId,
				},
				data: {
					totalDislikes: { decrement: 1 },
				},
			});

			return {id: 2}
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException(
					`The user doesn't have a dislike for this review`,
				);
			}
		}
	}

	async toggleLike(userId: number, reviewId: number, isLiked: boolean) {
		if (isLiked) {
			return await this.removeLike(userId, reviewId);
		} else {
			return await this.addLike(userId, reviewId);
		}
	}

	async toggleDislike(userId: number, reviewId: number, isDisliked: boolean) {
		if (isDisliked) {
			return await this.removeDislike(userId, reviewId);
		} else {
			return await this.addDislike(userId, reviewId);
		}
	}

	async findLikedReviews(userId: number): Promise<Set<number>> {
		const likedReviews = await this.db.review.findMany({
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

		const likedReviewIds = likedReviews.map((review) => review.id);

		return new Set(likedReviewIds);
	}

	async findDislikedReviews(userId: number): Promise<Set<number>> {
		const dislikedReviews = await this.db.review.findMany({
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

		const dislikedReviewIds = dislikedReviews.map((review) => review.id);

		return new Set(dislikedReviewIds);
	}

	async findCommentedReviews(userId: number): Promise<Set<number>> {
		const commentedReviews = await this.db.review.findMany({
			where: {
				comments: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const commentedReviewIds = commentedReviews.map((review) => review.id);

		return new Set(commentedReviewIds);
	}

	async transformReview(
		review: RawReview,
		userId: number,
	): Promise<ReviewResponse> {
		let likedReviewIds: Set<number> = new Set();
		let dislikedReviewIds: Set<number> = new Set();
		let commentedReviewIds: Set<number> = new Set();

		[likedReviewIds, dislikedReviewIds, commentedReviewIds] =
			await Promise.all([
				this.findLikedReviews(userId),
				this.findDislikedReviews(userId),
				this.findCommentedReviews(userId),
			]);

		const transformReview: ReviewResponse = {
			...review,
			isLiked: likedReviewIds.has(review.id),
			isDisliked: dislikedReviewIds.has(review.id),
			isCommented: commentedReviewIds.has(review.id),
		};

		return transformReview;
	}

	async transformReviews(
		reviews: RawReview[],
		userId?: number,
	): Promise<ReviewResponse[]> {
		let likedReviewIds: Set<number> = new Set();
		let dislikedReviewIds: Set<number> = new Set();
		let commentedReviewIds: Set<number> = new Set();

		if (userId) {
			[likedReviewIds, dislikedReviewIds, commentedReviewIds] =
				await Promise.all([
					this.findLikedReviews(userId),
					this.findDislikedReviews(userId),
					this.findCommentedReviews(userId),
				]);
		}

		const transformedReviews: ReviewResponse[] = reviews.map((review) => ({
			...review,
			isLiked: likedReviewIds.has(review.id),
			isDisliked: dislikedReviewIds.has(review.id),
			isCommented: commentedReviewIds.has(review.id),
		}));

		return transformedReviews;
	}

	async getReviewsForMovie(
		movieId: number,
		filter: ReviewFilterDto,
		sorting: ReviewSortingDto,
		pagination: ReviewPaginationDto,
		userId?: number,
	): Promise<GetReviewsForMovieResponse> {
		const {
			limit = 10,
			cursorId,
			cursorTotalLikes,
			cursorTotalDislikes,
		} = pagination;
		const { meLiked, meDisliked, meCommented } = filter;

		const { sort, order = 'desc' } = sorting;

		const orderBy: Record<string, typeof order>[] = [];

		if (sort === 'likes') {
			orderBy.push({ totalLikes: order }, { id: order });
		} else if (sort === 'dislikes') {
			orderBy.push({ totalDislikes: order }, { id: order });
		} else {
			orderBy.push({ id: order });
		}

		const isFirstPage = !(pagination?.cursorId)

		let userReview: ReviewResponse | null = null

		if(userId && isFirstPage) {
			userReview = await this.getUserReview(movieId, userId)
		}

		const adjustedLimit = isFirstPage && userReview ? limit - 1 : limit;

		const reviews = await this.db.review.findMany({
			skip: cursorId ? 1 : undefined,
			cursor: cursorId
				? {
						id: cursorId,
						...(sort === 'likes' && {
							totalLikes: cursorTotalLikes,
						}),
						...(sort === 'dislikes' && {
							totalDislikes: cursorTotalDislikes,
						}),
					}
				: undefined,
			take: adjustedLimit,
			where: {
				movieId,
				id: userReview ? { not: userReview.id } : {},
				likes: userId && meLiked ? { some: { userId } } : {},
				dislikes: userId && meDisliked ? { some: { userId } } : {},
				comments: userId && meCommented ? { some: { userId } } : {},
			},
			orderBy,
			include: userSelect
		});

		const allReviews = isFirstPage && userReview ? [userReview, ...reviews] : reviews;

		const transformedReviews = await this.transformReviews(allReviews, userId);

		const lastReviewIndex = allReviews.length - 1;

		const nextCursor: ReviewCursorResponse | null =
			allReviews.length === limit
				? {
						id: allReviews[lastReviewIndex].id,
						...(sort === 'likes' && {
							likes: allReviews[lastReviewIndex].totalLikes,
						}),
						...(sort === 'dislikes' && {
							dislikes: allReviews[lastReviewIndex].totalDislikes,
						}),
					}
				: null;

		return {
			data: transformedReviews,
			nextCursor,
		};
	}

	async getLastReviewsForMovie(movieId: number, limit: number): Promise<ReviewCardForMovieResponse[]> {
		const reviews = await this.db.review.findMany({
			take: limit,
			where: {
				movieId
			},
			select: reviewCardSelect,
			orderBy: { id: 'desc' }
		})

		return reviews
	}

	async getPopularReviewsForMovie(movieId: number, limit: number): Promise<ReviewCardForMovieResponse[]> {
		const reviews = await this.db.review.findMany({
			take: limit,
			where: {
				movieId
			},
			select: reviewCardSelect,
			orderBy: [{ totalLikes: 'desc'}, { totalComments: 'desc' }]
		})

		return reviews
	}

	async getLastReviews(limit: number): Promise<ReviewCardResponse[]> {
		const reviews = await this.db.review.findMany({
			take: limit,
			select: {
				...reviewCardSelect,
				movie: {
					select: {
						title: true
					}
				}
			},
			orderBy: { id: 'desc' }
		})

		

		return reviews.map((review) => ({...review, movieTitle: review.movie.title}))
	}

	async getPopularReviews(limit: number): Promise<ReviewCardResponse[]> {
		const reviews = await this.db.review.findMany({
			take: limit,
			select: {
				...reviewCardSelect,
				movie: {
					select: {
						title: true
					}
				}
			},
			orderBy: [{ totalLikes: 'desc' }, {totalComments: 'desc'}]
		})

		return reviews.map((review) => ({...review, movieTitle: review.movie.title}))
	}

	async getUserReview(movieId: number, userId?: number): Promise<ReviewResponse | null> {
		if(!userId) return null

		const review = await this.db.review.findUnique({
			where: {
				userId_movieId: { userId, movieId },
			},
			include: userSelect,
		});

		if(review) {
			return await this.transformReview(review, userId)
		} else {
			return null
		}
	}

	async createReview(
		userId: number,
		movieId: number,
		rating: number,
		message: string,
	): Promise<CreateReviewResponse> {
		try {
			const review = await this.db.review.create({
				data: {
					rating,
					message,
					user: {
						connect: {
							id: userId,
						},
					},
					movie: {
						connect: {
							id: movieId,
						},
					},
				},
				include: userSelect
			});

			const updatedMovie = await this.movieService.updateRating(movieId, rating, true);
			const updatedUser = await this.userService.updateTotalReviews(userId, true)

			return {...review, isDisliked: false, isLiked: false, isCommented: false, movie: updatedMovie, user: {...review.user, totalReviews: updatedUser.totalReviews}};
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					'User already has a review for this movie',
				);
			}

			if (isRecordNotFoundError(error)) {
				throw new BadRequestException('User or movie does not exist');
			}

			throw error;
		}
	}

	async deleteReview(userId: number, reviewId: number): Promise<DeleteReviewResponse> {
		const review = await this.findReviewById(reviewId)

		if(review.userId !== userId) {
			throw new ForbiddenException('This user cant delete this review')
		}

		const deletedReview = await this.db.review.delete({
			where: {
				id: reviewId,
			},
			select: {
				id: true,
				rating: true,
				movie: {
					select: {
						id: true,
						title: true,
					}
				}
			}
		});

		const updatedMovie = await this.movieService.updateRating(
			deletedReview.movie.id,
			0,
			false,
			deletedReview.rating,
		);
		const updatedUser = await this.userService.updateTotalReviews(userId, false)

		return {id: deletedReview.id, movie: updatedMovie, user: updatedUser};
	}

	async updateReview(
		userId: number,
		reviewId: number,
		rating: number,
		message: string,
	): Promise<UpdateReviewResponse> {
		const review = await this.findReviewById(reviewId)

		if(review.userId !== userId) {
			throw new ForbiddenException('This user cant update this review')
		}

		const updatedReview = await this.db.review.update({
			where: {
				id: reviewId,
			},
			data: {
				rating,
				message,
				isChanged: true,
			},
			select: {
				movie: {
					select: {
						id: true,
						title: true,
					}
				},
				id: true,
				message: true,
				rating: true,
				isChanged: true,
			}
		});

		const updatedMovie = await this.movieService.updateRating(
			updatedReview.movie.id,
			rating,
			undefined,
			review.rating,
		);

		return {
			id: updatedReview.id,
			message: updatedReview.message,
			rating: updatedReview.rating,
			isChanged: updatedReview.isChanged,
			movie: updatedMovie
		};
	}

	async updateTotalComments(reviewId: number, isIncrement: boolean): Promise<UpdateReviewTotalCommentsResponse> {
		const updatedReview = await this.db.review.update({
			where: {
				id: reviewId,
			},
			data: {
				totalComments: isIncrement
					? { increment: 1 }
					: { decrement: 1 },
			},
			select: {
				id: true,
				totalComments: true,
			},
		});
		return updatedReview;
	}
}
