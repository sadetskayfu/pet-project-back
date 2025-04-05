import {
	Body,
	Controller,
	Delete,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ToggleWatchedDto, WatchedMovieResponse } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WatchedMovieService } from './watchedMovies.service';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfo } from '../auth/session-info.decorator';
import { SessionInfoDto } from '../auth/dto';

@ApiTags('Watched-movies')
@Controller('watched-movies')
export class WatchedMovieController {
	constructor(private watchedMovieService: WatchedMovieService) {}

	@Post(':id')
	@ApiOperation({ summary: 'Добавить фильм в список просмотренных' })
	@ApiResponse({
		status: 201,
		type: WatchedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async addToWatched(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
	): Promise<WatchedMovieResponse> {
		return this.watchedMovieService.addToWatched(session.id, movieId);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить фильм из списка просмотренных' })
	@ApiResponse({
		status: 200,
		type: WatchedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async removeFormWatched(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
	): Promise<WatchedMovieResponse> {
		return this.watchedMovieService.removeFormWatched(session.id, movieId);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Добавить/Удалить фильм из списка просмотренных' })
	@ApiResponse({
		status: 200,
		type: WatchedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async toggleWatched(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
		@Body() body: ToggleWatchedDto,
	): Promise<WatchedMovieResponse> {
		return this.watchedMovieService.toggleWatched(
			session.id,
			movieId,
			body.isWatched,
		);
	}
}
