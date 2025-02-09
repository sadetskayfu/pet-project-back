import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movies.service';
import { CreateMovieDto, MovieFiltersDto } from './dto';
import {
	ApiBadRequestResponse,
	ApiCreatedResponse,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
	constructor(private movieService: MovieService) {}

	@Post()
	@ApiOperation({ summary: 'Создать фильм' })
	@ApiCreatedResponse({
		description: 'Movie has been successfully created',
	})
	@ApiBadRequestResponse({
		description: 'Invalid input data.',
	})
	async createMovie(@Body() body: CreateMovieDto) {
		return this.movieService.createMovie(body);
	}

	@ApiOperation({ summary: 'Получить фильмы' })
	@Get('filters')
	@UsePipes(new ValidationPipe({ transform: true }))
	async getMovies(@Query() filters: MovieFiltersDto) {
		const genreList = filters.genres?.split('+');
		const countryList = filters.countries?.split('+');

		const result = await this.movieService.getMovies({
			title: filters.title,
			genres: genreList,
			countries: countryList,
			rating: filters.rating,
			year: filters.year,
			pageSize: filters.pageSize,
			cursor: filters.cursor,
			sortedBy: filters.sortedBy,
		});

		return {
			data: result.movies,
			nextCursor: result.nextCursor,
		};
	}
}
