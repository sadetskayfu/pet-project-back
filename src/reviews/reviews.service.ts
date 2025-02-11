import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MovieService } from 'src/movies/movies.service';
import { ReviewLikeService } from 'src/reviewLikes/reviewLikes.service';
import { ReviewResponse } from './dto';

@Injectable()
export class ReviewService {
	private readonly logger = new Logger(ReviewService.name);

	constructor(
		private db: DbService,
		private movieService: MovieService,
		private likeService: ReviewLikeService,
	) {}

	async findReviewById(id: number) {
		this.logger.log(`Finding review by ID '${id}'`);

		const review = await this.db.review.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				userId: true,
				movieId: true,
				rating: true
			}
		});

		this.logger.log(`Found review: ${JSON.stringify(review)}`);

		if (!review) {
			throw new NotFoundException(
				`Review with ID '${id}' does not exist`,
			);
		}

		return review;
	}

	async findUserReview(userId: number, movieId: number) {
		this.logger.log(`Finding review by user ID '${userId}'`);

		const review = await this.db.review.findUnique({
			where: {
				userId,
				movieId,
			},
		});

		this.logger.log(`Found review: ${JSON.stringify(review)}`);

		if (!review) {
			throw new NotFoundException(
				`User review for movie with ID '${movieId}' does not exist`,
			);
		}

		const userLike = await this.likeService.findUserLike(userId, review.id)

		const reviewWithLike = {
			...review,
			isLiked: !!userLike
		}
		 
		return reviewWithLike
	}

	async getReviewsForMovie(
		movieId: number,
		limit: number = 10,
		cursor?: number,
		orderBy: 'desc' | 'asc' = 'desc',
		userId?: number,
	) {
		this.logger.log(`Getting reviews for movie with ID '${movieId}'`);

		const reviews = await this.db.review.findMany({
			skip: cursor ? 1 : undefined,
			cursor: cursor ? { id: cursor } : undefined,
			take: limit,
			where: {
				movieId,
			},
			orderBy: {
				id: orderBy,
			},
		});

		let reviewsWithLikes: ReviewResponse[] = []

		if (userId) {
			const reviewIds = reviews.map((review) => review.id);

			const likedReviews = await this.likeService.findLikedReviews(
				userId,
				reviewIds,
			);

			const likedReviewIds = new Set(
				likedReviews.map((like) => like.reviewId),
			);

			reviewsWithLikes = reviews.map((review) => ({
				...review,
				isLiked: likedReviewIds.has(review.id),
			}));
		} else {
			reviewsWithLikes = reviews.map((review) => ({
				...review,
				isLiked: false
			}))
		}

		const nextCursor =
			reviews.length === limit ? reviews[reviews.length - 1].id : null;

		this.logger.log(`Found reviews: ${JSON.stringify(reviewsWithLikes)}`);

		return {
			reviews: reviewsWithLikes,
			nextCursor,
		};
	}

	async createReview(
		userId: number,
		movieId: number,
		rating: number,
		message: string,
	) {
		const existingReview = await this.db.review.findUnique({
			where: {
				userId,
				movieId,
			},
		});

		if (existingReview) {
			throw new BadRequestException(
				`User with ID ${userId} already has a review form movie with ID '${movieId}'`,
			);
		}

		this.logger.log(`Creating review to movie with ID '${movieId}'`);

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
		});

		const reviewWithLike = {
			...review,
			isLiked: false
		}

		this.logger.log(`Review created: ${JSON.stringify(reviewWithLike)}`);

		await this.movieService.updateRating(movieId, rating, true);

		return reviewWithLike;
	}

	async deleteReview(userId: number, reviewId: number) {
		const review = await this.findReviewById(reviewId);

		if (review.userId !== userId) {
			throw new ForbiddenException(
				`User with ID '${userId}' cant delete review with ID '${reviewId}' `,
			);
		}

		this.logger.log(`Deleting review with ID ${reviewId}`);

		const deletedReview = await this.db.review.delete({
			where: {
				id: reviewId,
			},
			select: {
				id: true
			}
		});

		this.logger.log(`Review deleted: ${JSON.stringify(deletedReview)}`);

		await this.movieService.updateRating(
			review.movieId,
			0,
			false,
			review.rating,
		);

		return deletedReview;
	}

	async updateReview(
		userId: number,
		reviewId: number,
		rating: number,
		message: string,
	) {
		const review = await this.findReviewById(reviewId);

		if (review.userId !== userId) {
			throw new ForbiddenException(
				`User with ID '${userId}' cant update review with ID '${reviewId}' `,
			);
		}

		this.logger.log(`Updating review by ID '${reviewId}'`);

		const updatedReview = await this.db.review.update({
			where: {
				id: reviewId,
			},
			data: {
				rating,
				message,
				isChanged: true,
			},
		});

		const isLiked = await this.likeService.findUserLike(userId, reviewId)

		const updatedReviewWithLike = {
			...updatedReview,
			isLiked: !!isLiked
		}

		this.logger.log(`Review updated: ${JSON.stringify(updatedReviewWithLike)}`);

		await this.movieService.updateRating(
			review.movieId,
			rating,
			undefined,
			review.rating,
		);

		return updatedReviewWithLike;
	}

	async updateTotalLikes(reviewId: number, isIncrement: boolean) {
		this.logger.log(
			`Updating total likes for review with ID '${reviewId}'`,
		);

		const updatedReview = await this.db.review.update({
			where: {
				id: reviewId,
			},
			data: {
				totalLikes: isIncrement ? { increment: 1 } : { decrement: 1 },
			},
			select: {
				id: true,
				totalLikes: true
			}
		});

		this.logger.log(`Review updated: ${JSON.stringify(updatedReview)}`);

		return updatedReview;
	}

	async toggleUserLike(userId: number, reviewId: number) {
		await this.findReviewById(reviewId);

		const userLike = await this.likeService.findUserLike(userId, reviewId);

		if (userLike) {
			await this.likeService.removeLike(userId, reviewId);

			const updatedReview = await this.updateTotalLikes(reviewId, false);

			return {
				...updatedReview,
				isLiked: false
			}
		} else {
			await this.likeService.addLike(userId, reviewId);

			const updatedReview = await this.updateTotalLikes(reviewId, true);

			return {
				...updatedReview,
				isLiked: true
			}
		}
	}
}
