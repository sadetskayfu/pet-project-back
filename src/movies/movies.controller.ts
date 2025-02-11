import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movies.service';
import {
	CreateMovieDto,
	FilterDto,
	PaginationDto,
	SortingDto,
} from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
	constructor(private movieService: MovieService) {}

	@Post()
	@ApiOperation({ summary: 'Создать фильм' })
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async createMovie(@Body() body: CreateMovieDto) {
		return this.movieService.createMovie(body);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить фильм по id' })
	async getMovieById(@Param('id', ParseIntPipe) id: number) {
		return this.movieService.findMovieById(id);
	}

	@Get()
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: 'Получить фильмы' })
	async getMovies(
		@Query() filter: FilterDto,
		@Query() pagination: PaginationDto,
		@Query() sorting: SortingDto,
	) {
		const result = await this.movieService.getMovies(filter, pagination, sorting);

		return {
			data: result.movies,
			nextCursor: result.nextCursor,
		};
	}
}
