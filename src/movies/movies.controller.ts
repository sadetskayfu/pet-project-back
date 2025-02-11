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
	DeleteMovieResponse,
	FilterDto,
	GetMoviesResponse,
	MovieResponse,
	PaginationDto,
	SortingDto,
	UpdateMovieDto,
} from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

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
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async createMovie(@Body() body: CreateMovieDto): Promise<MovieResponse> {
		return this.movieService.createMovie(body);
	}

	@Put()
	@ApiOperation({ summary: 'Обновить фильм' })
	@ApiResponse({
		status: 200,
		type: MovieResponse,
	})
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async updateMovie(@Body() body: UpdateMovieDto): Promise<MovieResponse> {
		return this.movieService.updateMovie(body);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить фильм' })
	@ApiResponse({
		status: 200,
		type: DeleteMovieResponse,
	})
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async deleteMovie(
		@Param('id', ParseIntPipe) id: number,
	): Promise<DeleteMovieResponse> {
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
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: 'Получить фильмы' })
	@ApiResponse({
		status: 200,
		type: GetMoviesResponse,
	})
	async getMovies(
		@Query() filter: FilterDto,
		@Query() pagination: PaginationDto,
		@Query() sorting: SortingDto,
	): Promise<GetMoviesResponse> {
		const result = await this.movieService.getMovies(
			filter,
			pagination,
			sorting,
		);

		return {
			data: result.transformedMovies,
			nextCursor: result.nextCursor,
		};
	}
}
