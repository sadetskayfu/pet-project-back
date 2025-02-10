import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
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
import { CreateReviewDto, PaginationDto, UpdateReviewDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { SessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Reviews')
@Controller('movies/:movieId/reviews')
export class ReviewController {
    private readonly logger = new Logger(ReviewController.name);

	constructor(private reviewService: ReviewService) {}

	@Get()
	@UsePipes(new ValidationPipe({ transform: true }))
	async getReviewsForMovie(
		@Param('movieId', ParseIntPipe) id: number,
		@Query() paginationDto: PaginationDto,
	) {
		const { reviews, nextCursor } =
			await this.reviewService.getReviewsForMovie(
				id,
				paginationDto.pageSize,
				paginationDto.cursor,
			);

		return {
			data: reviews,
			nextCursor,
		};
	}

	@Post()
	async createReview(@Body() body: CreateReviewDto) {
		const { userId, movieId, rating, message } = body;

		return this.reviewService.createReview(
			userId,
			movieId,
			rating,
			message,
		);
	}

	@Put()
	async updateReview(@Body() body: UpdateReviewDto) {
		const { reviewId, rating, message } = body;

		return this.reviewService.updateReview(reviewId, rating, message);
	}

	@Delete(':id')
	async deleteReview(@Param('id', ParseIntPipe) id: number) {
		return this.reviewService.deleteReview(id);
	}

	@Post('likes/:reviewId')
	@UseGuards(AuthGuard)
	async addLikeToReview(
		@Param('reviewId', ParseIntPipe) reviewId: number,
		@SessionInfo() session: SessionInfoDto,
	) {
        this.logger.log(session.id)

		return this.reviewService.addLikeToReview(session.id, reviewId);
	}
}
