import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto, DeletedReviewResponse, GetReviewsForMovieResponse, OrderByDto, PaginationDto, ReviewResponse, UpdateReviewDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { SessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
	constructor(private reviewService: ReviewService) {}

	@Get()
	@ApiOperation({
		summary: 'Получить отзывы к фильму'
	})
	@ApiResponse({
		status: 200,
		type: GetReviewsForMovieResponse
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getReviewsForMovie(
		@Query('movieId', ParseIntPipe) id: number,
		@Query() pagination: PaginationDto,
		@Query() orderBy: OrderByDto
	): Promise<GetReviewsForMovieResponse> {
		const { reviews, nextCursor } =
			await this.reviewService.getReviewsForMovie(
				id,
				pagination.limit,
				pagination.cursor,
				orderBy.orderBy,
			);

		return {
			data: reviews,
			nextCursor,
		};
	}

	@Post()
	@ApiOperation({
		summary: 'Оставить отзыв'
	})
	@ApiResponse({
		status: 201,
		type: ReviewResponse
	})
	@UseGuards(AuthGuard)
	async createReview(@Body() body: CreateReviewDto, @SessionInfo() session: SessionInfoDto): Promise<ReviewResponse> {
		const { movieId, rating, message } = body;

		return this.reviewService.createReview(
			session.id,
			movieId,
			rating,
			message,
		);
	}

	@Put()
	@ApiOperation({
		summary: 'Обновить отзыв'
	})
	@ApiResponse({
		status: 200,
		type: ReviewResponse
	})
	@UseGuards(AuthGuard)
	async updateReview(@Body() body: UpdateReviewDto, @SessionInfo() session: SessionInfoDto): Promise<ReviewResponse> {
		const { reviewId, rating, message } = body;

		return this.reviewService.updateReview(session.id, reviewId, rating, message);
	}

	@Delete()
	@ApiOperation({
		summary: 'Удалить отзыв'
	})
	@ApiResponse({
		status: 200,
		type: DeletedReviewResponse
	})
	@UseGuards(AuthGuard)
	async deleteReview(@Query('id', ParseIntPipe) id: number, @SessionInfo() session: SessionInfoDto): Promise<DeletedReviewResponse> {
		return this.reviewService.deleteReview(session.id, id);
	}

	@Put('likes')
	@UseGuards(AuthGuard)
	async toggleUserLike(
		@Query('reviewId', ParseIntPipe) reviewId: number,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.reviewService.toggleUserLike(session.id, reviewId);
	}
}
