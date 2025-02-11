import {
	Body,
	Controller,
	Delete,
	Get,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/auth/session-info.decorator';
import { SessionInfoDto } from 'src/auth/dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentService } from './comments.service';
import {
	CommentResponse,
	CreateCommentDto,
	DeletedCommentResponse,
	GetCommentsForReviewResponse,
	OrderDto,
	PaginationDto,
	UpdateCommentDto,
} from './dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
	constructor(private commentService: CommentService) {}

	@Get()
	@ApiOperation({
		summary: 'Получить комментарии к отзыву',
	})
	@ApiResponse({
		status: 200,
		type: GetCommentsForReviewResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getCommentsForReview(
		@Query('reviewId', ParseIntPipe) reviewId: number,
		@Query() pagination: PaginationDto,
		@Query() order: OrderDto,
	): Promise<GetCommentsForReviewResponse> {
		const { comments, nextCursor } =
			await this.commentService.getCommentsForReview(
				reviewId,
				pagination.limit,
				pagination.cursor,
				order.order,
			);

		return {
			data: comments,
			nextCursor,
		};
	}

	@Post()
	@ApiOperation({
		summary: 'Оставить комментарий',
	})
	@ApiResponse({
		status: 201,
		type: CommentResponse,
	})
	@UseGuards(AuthGuard)
	async createReview(
		@Body() body: CreateCommentDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<CommentResponse> {
		const { reviewId, message } = body;

		return this.commentService.createComment(session.id, reviewId, message);
	}

	@Put()
	@ApiOperation({
		summary: 'Обновить комментарий',
	})
	@ApiResponse({
		status: 200,
		type: CommentResponse,
	})
	@UseGuards(AuthGuard)
	async updateReview(
		@Body() body: UpdateCommentDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<CommentResponse> {
		const { commentId, message } = body;

		return this.commentService.updateComment(
			session.id,
			commentId,
			message,
		);
	}

	@Delete()
	@ApiOperation({
		summary: 'Удалить комментарий',
	})
	@ApiResponse({
		status: 200,
		type: DeletedCommentResponse,
	})
	@UseGuards(AuthGuard)
	async deleteReview(
		@Query('commentId', ParseIntPipe) commentId: number,
		@SessionInfo() session: SessionInfoDto,
	): Promise<DeletedCommentResponse> {
		return this.commentService.deleteComment(session.id, commentId);
	}

	@Put('likes')
	@UseGuards(AuthGuard)
	async toggleUserLike(
		@Query('commentId', ParseIntPipe) commentId: number,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.commentService.toggleUserLike(session.id, commentId);
	}
}
