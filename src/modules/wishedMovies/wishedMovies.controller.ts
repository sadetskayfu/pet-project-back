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
import { ToggleWishedDto, WishedMovieResponse } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { SessionInfo } from '../auth/session-info.decorator';
import { SessionInfoDto } from '../auth/dto';
import { WishedMovieService } from './wishedMovies.service';

@ApiTags('Wished-movies')
@Controller('wished-movies')
export class WishedMovieController {
	constructor(private wishedMovieService: WishedMovieService) {}

	@Post(':id')
	@ApiOperation({ summary: 'Добавить фильм в список желаемых' })
	@ApiResponse({
		status: 201,
		type: WishedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async addToWished(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
	): Promise<WishedMovieResponse> {
		return this.wishedMovieService.addToWished(session.id, movieId);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить фильм из списка желаемых' })
	@ApiResponse({
		status: 200,
		type: WishedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async removeFormWished(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
	): Promise<WishedMovieResponse> {
		return this.wishedMovieService.removeFormWished(session.id, movieId);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Добавить/Удалить фильм из списка желаемых' })
	@ApiResponse({
		status: 200,
		type: WishedMovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(AuthGuard)
	async toggleWished(
		@SessionInfo() session: SessionInfoDto,
		@Param('id', ParseIntPipe) movieId: number,
		@Body() body: ToggleWishedDto,
	): Promise<WishedMovieResponse> {
		return this.wishedMovieService.toggleWished(
			session.id,
			movieId,
			body.isWished,
		);
	}
}
