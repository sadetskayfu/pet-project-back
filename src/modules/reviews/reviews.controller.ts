import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import {
	CreateReviewDto,
	CreateReviewResponse,
	DeleteReviewResponse,
	GetReviewsForMovieResponse,
	ReviewCardForMovieResponse,
	ReviewCardResponse,
	ReviewFilterDto,
	ReviewPaginationDto,
	ReviewResponse,
	ReviewSortingDto,
	ToggleDislikeDto,
	ToggleLikeDto,
	UpdateReviewDto,
	UpdateReviewResponse,
} from './dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/modules/auth/session-info.decorator';
import { SessionInfoDto } from 'src/modules/auth/dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@Get('all/:movieId')
	@ApiOperation({
		summary: 'Получить отзывы к фильму',
	})
	@ApiResponse({
		status: 200,
		type: GetReviewsForMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(OptionalAuthGuard)
	async getReviewsForMovie(
		@Param('movieId') movieId: number,
		@Query() pagination: ReviewPaginationDto,
		@Query() sorting: ReviewSortingDto,
		@Query() filter: ReviewFilterDto,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<GetReviewsForMovieResponse> {
		const { data, nextCursor } =
			await this.reviewService.getReviewsForMovie(
				movieId,
				filter,
				sorting,
				pagination,
				session?.id,
			);
		return {
			data,
			nextCursor,
		};
	}

	@Get(':movieId/user-review')
	@ApiOperation({
		summary: 'Получить отзыв пользователя к фильму',
	})
	@ApiResponse({
		status: 200,
		type: ReviewResponse,
	})
	@UseGuards(OptionalAuthGuard)
	async getUserReview(
		@Param('movieId', ParseIntPipe) movieId: number,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<ReviewResponse | null> {
		return this.reviewService.getUserReview(movieId, session?.id);
	}

	@Get(':movieId/popular')
	@ApiOperation({
		summary: 'Получить популярные отзывы к фильму для карточек',
	})
	@ApiResponse({
		status: 200,
		type: [ReviewCardForMovieResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 10'
	})
	async getPopularReviewsForMovie(
		@Param('movieId', ParseIntPipe) movieId: number,
		@Query('limit', new ParseIntPipe({optional: true})) limit: number = 10,
	): Promise<ReviewCardForMovieResponse[]> {
		return this.reviewService.getPopularReviewsForMovie(
			movieId,
			limit,
		);
	}

	@Get(':movieId/last')
	@ApiOperation({
		summary: 'Получить последние отзывы к фильму для карточек',
	})
	@ApiResponse({
		status: 200,
		type: [ReviewCardForMovieResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 10'
	})
	async getLastReviewsForMovie(
		@Param('movieId', ParseIntPipe) movieId: number,
		@Query('limit', new ParseIntPipe({optional: true})) limit: number = 10,
	): Promise<ReviewCardForMovieResponse[]> {
		return this.reviewService.getLastReviewsForMovie(
			movieId,
			limit,
		);
	}

	@Get('popular')
	@ApiOperation({
		summary: 'Получить популярные отзывы для карточек',
	})
	@ApiResponse({
		status: 200,
		type: [ReviewCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30'
	})
	async getPopularReviews(
		@Query('limit', new ParseIntPipe({optional: true})) limit: number = 30,
	): Promise<ReviewCardResponse[]> {
		return this.reviewService.getPopularReviews(
			limit,
		);
	}

	@Get('last')
	@ApiOperation({
		summary: 'Получить последние отзывы для карточек',
	})
	@ApiResponse({
		status: 200,
		type: [ReviewCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30',
	})
	async getLastReviews(
		@Query('limit', new ParseIntPipe({optional: true})) limit: number = 30,
	): Promise<ReviewCardResponse[]> {

		return this.reviewService.getLastReviews(
			limit,
		);
	}

	@Post()
	@ApiOperation({
		summary: 'Оставить отзыв',
	})
	@ApiResponse({
		status: 201,
		type: CreateReviewResponse,
	})
	@UseGuards(AuthGuard)
	async createReview(
		@Body() body: CreateReviewDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<CreateReviewResponse> {
		const { movieId, rating, message } = body;

		return this.reviewService.createReview(
			session.id,
			movieId,
			rating,
			message,
		);
	}

	@Put(':id')
	@ApiOperation({
		summary: 'Обновить отзыв',
	})
	@ApiResponse({
		status: 200,
		type: UpdateReviewResponse,
	})
	@UseGuards(AuthGuard)
	async updateReview(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateReviewDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<UpdateReviewResponse> {
		const { rating, message } = body;

		return this.reviewService.updateReview(session.id, id, rating, message);
	}

	@Delete(':id')
	@ApiOperation({
		summary: 'Удалить отзыв',
	})
	@ApiResponse({
		status: 200,
		type: DeleteReviewResponse,
	})
	@UseGuards(AuthGuard)
	async deleteReview(
		@Param('id', ParseIntPipe) id: number,
		@SessionInfo() session: SessionInfoDto,
	): Promise<DeleteReviewResponse> {
		return this.reviewService.deleteReview(session.id, id);
	}

	@Patch(':reviewId/like')
	@ApiOperation({
		summary: 'Поставить / убрать лайк',
	})
	@ApiResponse({
		status: 200,
	})
	@UseGuards(AuthGuard)
	async toggleLike(
		@Param('reviewId', ParseIntPipe) reviewId: number,
		@Body() body: ToggleLikeDto,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.reviewService.toggleLike(session.id, reviewId, body.isLiked)
	}

	@Patch(':reviewId/dislike')
	@ApiOperation({
		summary: 'Поставить / убрать дизлайк',
	})
	@ApiResponse({
		status: 200,
	})
	@UseGuards(AuthGuard)
	async toggleDisLike(
		@Param('reviewId', ParseIntPipe) reviewId: number,
		@Body() body: ToggleDislikeDto,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.reviewService.toggleDislike(session.id, reviewId, body.isDisliked)
	}
}
