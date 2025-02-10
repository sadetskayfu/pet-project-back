import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { MovieService } from 'src/movies/movies.service';
import { ReviewLikeService } from 'src/reviewLikes/reviewLikes.service';

@Injectable()
export class ReviewService {
	private readonly logger = new Logger(ReviewService.name);

	constructor(
		private db: DbService,
		private movieService: MovieService,
        private likeService: ReviewLikeService
	) {}

	async findReviewById(id: number) {
		this.logger.log(`Finding review by ID '${id}'`);

		const review = await this.db.review.findUnique({
			where: {
				id,
			},
		});

		this.logger.log(`Found review: ${JSON.stringify(review)}`);

		if (!review) {
			throw new NotFoundException(
				`Review with ID '${id}' does not exist`,
			);
		}

		return review;
	}

    async findReviewFromMovieByUserId(userId: number, movieId: number) {
        this.logger.log(`Finding review by user ID '${userId}'`);

        const review = await this.db.review.findUnique({
            where: {
                userId,
                movieId
            }
        })

        this.logger.log(`Found review: ${JSON.stringify(review)}`)

        if(!review) {
            throw new NotFoundException(`User review for movie with ID '${movieId}' does not exist`)
        }

        return review
    }

    async getReviewsForMovie(movieId: number, pageSize: number = 10, cursor?: number) {
        this.logger.log(`Getting reviews for movie with ID '${movieId}'`)

        const reviews = await this.db.review.findMany({
            skip: cursor ? 1 : undefined,
            cursor: cursor ? { id: cursor } : undefined,
            take: pageSize,
            where: {
                movieId,
            },
            orderBy: {
                id: 'desc'
            }
        })

        const nextCursor = reviews.length === pageSize ? reviews[reviews.length - 1].id : null

        this.logger.log(`Found reviews: ${JSON.stringify(reviews)}`)

        return {
            reviews,
            nextCursor
        }
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

		this.logger.log(`Review created: ${JSON.stringify(review)}`);

		await this.movieService.updateRating(movieId, rating, true);

		return review;
	}

	async deleteReview(reviewId: number) {
		const review = await this.findReviewById(reviewId);

		this.logger.log(`Deleting review with ID ${reviewId}`);

		const deletedReview = await this.db.review.delete({
			where: {
				id: reviewId,
			},
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

	async updateReview(reviewId: number, rating: number, message: string) {
		const review = await this.findReviewById(reviewId);

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

		this.logger.log(`Review updated: ${JSON.stringify(updatedReview)}`);

		await this.movieService.updateRating(
			review.movieId,
			rating,
			undefined,
			review.rating,
		);

        return updatedReview
	}

    async updateTotalLikes(reviewId: number, isIncrement: boolean) {
        this.logger.log(`Updating total likes for review with ID '${reviewId}'`)

        const updatedReview = await this.db.review.update({
            where: {
                id: reviewId
            },
            data: {
                totalLikes: isIncrement ? { increment: 1 } : { decrement: 1}
            }
        })

        this.logger.log(`Review updated: ${JSON.stringify(updatedReview)}`)

        return updatedReview
    }

    async addLikeToReview(userId: number, reviewId: number) {
        await this.likeService.addLike(userId, reviewId)

        return this.updateTotalLikes(reviewId, true)
    }

    async removeLikeFromReview(userId: number, reviewId: number) {
        await this.likeService.removeLike(userId, reviewId)
        
        return this.updateTotalLikes(reviewId, false)
    }
}
