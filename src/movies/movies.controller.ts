import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { MovieService } from './movies.service';
import { CreateMovieDto, FilterWithPaginationDto, } from './dto';
import {
	ApiOperation,
	ApiTags,
} from '@nestjs/swagger';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
	constructor(private movieService: MovieService) {}

	@Post()
	@ApiOperation({ summary: 'Создать фильм' })
	async createMovie(@Body() body: CreateMovieDto) {
		return this.movieService.createMovie(body);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Получить фильм по id' })
	async getMovieById(@Param('id', ParseIntPipe) id: number) {
		return this.movieService.findMovieById(id)
	}

	
	@Get()
	@UsePipes(new ValidationPipe({ transform: true }))
	@ApiOperation({ summary: 'Получить фильмы' })
	async getMovies(@Query() params: FilterWithPaginationDto) {
		const genreList = params.genres?.split('+');
		const countryList = params.countries?.split('+');

		const result = await this.movieService.getMovies({
			title: params.title,
			genres: genreList,
			countries: countryList,
			rating: params.rating,
			year: params.year,
			pageSize: params.pageSize,
			cursor: params.cursor,
			sortedBy: params.sortedBy,
		});

		return {
			data: result.movies,
			nextCursor: result.nextCursor,
		};
	}
}
