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
	FilterDto,
	GetReviewsForMovieResponse,
	PaginationDto,
	ReviewForCardResponse,
	ReviewForCardResponseByMovieId,
	ReviewResponse,
	SortingDto,
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

	@Get(':movieId')
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
		@Param('movieId', ParseIntPipe) movieId: number,
		@Query() pagination: PaginationDto,
		@Query() sorting: SortingDto,
		@Query() filter: FilterDto,
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
	@UsePipes(new ValidationPipe({ transform: true }))
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
		type: [ReviewForCardResponseByMovieId],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 10'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getPopularReviewsForCardByMovieId(
		@Param('movieId', ParseIntPipe) movieId: number,
		@Query('limit', ParseIntPipe) limit?: number,
	): Promise<ReviewForCardResponseByMovieId[]> {
		return this.reviewService.getPopularReviewsForCardByMovieId(
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
		type: [ReviewForCardResponseByMovieId],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 10'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getLastReviewsForCardByMovieId(
		@Param('movieId', ParseIntPipe) movieId: number,
		@Query('limit', ParseIntPipe) limit?: number,
	): Promise<ReviewForCardResponseByMovieId[]> {
		return this.reviewService.getLastReviewsForCardByMovieId(
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
		type: [ReviewForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getPopularReviewsForCard(
		@Query('limit', ParseIntPipe) limit?: number,
	): Promise<ReviewForCardResponse[]> {
		return this.reviewService.getPopularReviewsForCard(
			limit,
		);
	}

	@Get('last')
	@ApiOperation({
		summary: 'Получить последние отзывы для карточек',
	})
	@ApiResponse({
		status: 200,
		type: [ReviewForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30'
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getLastReviewsForCard(
		@Query('limit', ParseIntPipe) limit?: number,
	): Promise<ReviewForCardResponse[]> {
		return this.reviewService.getLastReviewsForCard(
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
		type: ReviewResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
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
	@UsePipes(new ValidationPipe({ transform: true }))
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
	@UsePipes(new ValidationPipe({ transform: true }))
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
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async toggleDisLike(
		@Param('reviewId', ParseIntPipe) reviewId: number,
		@Body() body: ToggleDislikeDto,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.reviewService.toggleDislike(session.id, reviewId, body.isDisliked)
	}
}
