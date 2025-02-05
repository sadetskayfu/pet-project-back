import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreBodyDto, GenreDto, UpdateGenreBodyDto } from './dto';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
	constructor(private genreService: GenreService) {}

	@Get()
    @ApiOperation({ summary: 'Получить все жанры' })
    @ApiOkResponse({ 
        description: 'List of all genres retrieved successfully',
        type: [GenreDto] 
    })
	async getGenres() {
		return this.genreService.getGenres();
	}

	@Post()
    @ApiOperation({ summary: 'Создать новый жанр' })
    @ApiCreatedResponse({
        description: 'Genre has been successfully created',
        type: GenreDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data or genre with this name already existing.'
    })
	async createGenre(@Body() body: CreateGenreBodyDto) {
		return this.genreService.createGenre(body.name);
	}

	@Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Удалить жанра по ID' })
    @ApiOkResponse({
        description: 'Genre has been successfully deleted',
        type: GenreDto
    })
    @ApiNotFoundResponse({
        description: 'Genre with given ID not found'
    })
	async deleteGenre(@Param('id') id: string) {
		const numberId = parseInt(id);

		return this.genreService.deleteGenre(numberId);
	}

	@Put()
    @ApiOperation({ summary: 'Обновить жанр по ID' })
    @ApiOkResponse({
        description: 'Genre has been successfully updated',
        type: GenreDto
    })
    @ApiBadRequestResponse({
        description: 'Invalid input data or genre with this name already existing'
    })
    @ApiNotFoundResponse({
        description: 'Genre with given ID not found'
    })
	async updateGenre(@Body() body: UpdateGenreBodyDto) {
		return this.genreService.updateGenre(body.id, body.name);
	}
}
