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
import { MovieService } from './movies.service';
import {
	CreateMovieDto,
	FilterDto,
	GetMoviesResponse,
	MovieResponse,
	PaginationDto,
	SortingDto,
} from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { SessionInfoDto } from '../auth/dto';
import { SessionInfo } from '../auth/session-info.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
	constructor(private movieService: MovieService) {}

	@Post()
	@ApiOperation({ summary: 'Создать фильм' })
	@ApiResponse({
		status: 201,
		type: MovieResponse,
	})
	// @Roles('admin')
	// @UseGuards(AuthGuard, RolesGuard)
	async createMovie(@Body() body: CreateMovieDto): Promise<MovieResponse> {
		return this.movieService.createMovie(body);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Обновить фильм' })
	@ApiResponse({
		status: 200,
		type: MovieResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	// @Roles('admin')
	// @UseGuards(AuthGuard, RolesGuard)
	async updateMovie(@Param('id', ParseIntPipe) id: number, @Body() body: CreateMovieDto): Promise<MovieResponse> {
		return this.movieService.updateMovie(id, body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить фильм' })
	@ApiResponse({
		status: 200,
		type: MovieResponse,
	})
	// @Roles('admin')
	// @UseGuards(AuthGuard, RolesGuard)
	async deleteMovie(
		@Param('id', ParseIntPipe) id: number,
	): Promise<MovieResponse> {
		return this.movieService.deleteMovie(id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить фильм по id' })
	@ApiResponse({
		status: 200,
		type: MovieResponse,
	})
	async getMovieById(
		@Param('id', ParseIntPipe) id: number,
	): Promise<MovieResponse> {
		return this.movieService.getMovieById(id);
	}

	@Get()
	@ApiOperation({ summary: 'Получить фильмы' })
	@ApiResponse({
		status: 200,
		type: GetMoviesResponse,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	@UseGuards(OptionalAuthGuard)
	async getMovies(
		@Query() filter: FilterDto,
		@Query() pagination: PaginationDto,
		@Query() sorting: SortingDto,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<GetMoviesResponse> {
		const { data, nextCursor } = await this.movieService.getMovies(
			filter,
			pagination,
			sorting,
			session?.id
		);

		return {
			data,
			nextCursor,
		};
	}
}
