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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/modules/auth/session-info.decorator';
import { SessionInfoDto } from 'src/modules/auth/dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { CommentService } from './comments.service';
import {
	CreateCommentDto,
	CreateCommentResponse,
	DeleteCommentResponse,
	GetCommentsForReviewResponse,
	PaginationDto,
	ToggleDislikeDto,
	ToggleLikeDto,
	UpdateCommentDto,
	UpdateCommentResponse,
} from './dto';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
	constructor(private commentService: CommentService) {}

	@Get(':reviewId')
	@ApiOperation({
		summary: 'Получить комментарии к отзыву',
	})
	@ApiResponse({
		status: 200,
		type: GetCommentsForReviewResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(OptionalAuthGuard)
	async getCommentsForReview(
		@Param('reviewId', ParseIntPipe) reviewId: number,
		@Query() pagination: PaginationDto,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<GetCommentsForReviewResponse> {
		const { data, nextCursor } =
			await this.commentService.getCommentsForReview(
				reviewId,
				pagination,
				session?.id
			);

		return {
			data,
			nextCursor,
		};
	}

	@Post()
	@ApiOperation({
		summary: 'Оставить комментарий',
	})
	@ApiResponse({
		status: 201,
		type: CreateCommentResponse,
	})
	@UseGuards(AuthGuard)
	async createReview(
		@Body() body: CreateCommentDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<CreateCommentResponse> {
		const { reviewId, message } = body;

		return this.commentService.createComment(session.id, reviewId, message);
	}

	@Put(':commentId')
	@ApiOperation({
		summary: 'Обновить комментарий',
	})
	@ApiResponse({
		status: 200,
		type: UpdateCommentResponse,
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	async updateReview(
		@Param('commentId') commentId: number,
		@Body() body: UpdateCommentDto,
		@SessionInfo() session: SessionInfoDto,
	): Promise<UpdateCommentResponse> {
		const { message } = body;

		return this.commentService.updateComment(
			session.id,
			commentId,
			message,
		);
	}

	@Delete(':commentId')
	@ApiOperation({
		summary: 'Удалить комментарий',
	})
	@ApiResponse({
		status: 200,
		type: DeleteCommentResponse,
	})
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe({ transform: true }))
	async deleteReview(
		@Param('commentId', ParseIntPipe) commentId: number,
		@SessionInfo() session: SessionInfoDto,
	): Promise<DeleteCommentResponse> {
		return this.commentService.deleteComment(session.id, commentId);
	}

	@Patch(':commentId/like')
	@ApiOperation({
		summary: 'Поставить / убрать отзыв',
	})
	@ApiResponse({
		status: 200,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async toggleLike(
		@Param('commentId', ParseIntPipe) commentId: number,
		@Body() body: ToggleLikeDto,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.commentService.toggleLike(session.id, commentId, body.isLiked)
	}

	@Patch(':commentId/dislike')
	@ApiOperation({
		summary: 'Поставить / убрать дизлайк',
	})
	@ApiResponse({
		status: 200,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async toggleDisLike(
		@Param('commentId', ParseIntPipe) commentId: number,
		@Body() body: ToggleDislikeDto,
		@SessionInfo() session: SessionInfoDto,
	) {
		return this.commentService.toggleDislike(session.id, commentId, body.isDisliked)
	}
}
