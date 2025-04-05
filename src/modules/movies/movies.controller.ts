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
	MovieForCardResponse,
	MovieResponse,
	PaginationDto,
	SortingDto,
} from './dto';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
	@UseGuards(OptionalAuthGuard)
	async getMovieById(
		@Param('id', ParseIntPipe) id: number,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<MovieResponse> {
		return this.movieService.getMovieById(id, session?.id);
	}

	@Get('all')
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

	@Get('by-genres')
	@ApiOperation({ summary: 'Получить фильмы по жанрам' })
	@ApiResponse({
		status: 200,
		type: [MovieForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30',
	})
	@ApiQuery({
		name: 'genres',
		type: String,
		required: true,
		description: 'Жанры (разделенные "+")',
		example: 'action+drama'
	})
	@UseGuards(OptionalAuthGuard)
	async getMoviesByGenres(
		@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
		@Query('genres') genres: string,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<MovieForCardResponse[]> {
		return this.movieService.getMoviesByGenres(
			limit,
			genres,
			session?.id
		);
	}

	@Get('hight-rated')
	@ApiOperation({ summary: 'Получить фильмы с высокой оценкой' })
	@ApiResponse({
		status: 200,
		type: [MovieForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30',
	})
	@UseGuards(OptionalAuthGuard)
	async getHighRatedMovies(
		@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<MovieForCardResponse[]> {
		return this.movieService.getHighRatedMovies(
			limit,
			session?.id
		);
	}

	@Get('popular')
	@ApiOperation({ summary: 'Получить фильмы с наибольшим кол-вом отзывов' })
	@ApiResponse({
		status: 200,
		type: [MovieForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30',
	})
	@UseGuards(OptionalAuthGuard)
	async getPopularMovies(
		@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<MovieForCardResponse[]> {
		return this.movieService.getPopularMovies(
			limit,
			session?.id
		);
	}

	@Get('last')
	@ApiOperation({ summary: 'Получить последне вышедшие фильмы' })
	@ApiResponse({
		status: 200,
		type: [MovieForCardResponse],
	})
	@ApiQuery({
		name: 'limit',
		type: Number,
		required: false,
		description: 'Default limit 30',
	})
	@UseGuards(OptionalAuthGuard)
	async getLastMovies(
		@Query('limit', new ParseIntPipe({ optional: true })) limit: number = 30,
		@SessionInfo() session?: SessionInfoDto,
	): Promise<MovieForCardResponse[]> {
		return this.movieService.getLastMovies(
			limit,
			session?.id
		);
	}
}
