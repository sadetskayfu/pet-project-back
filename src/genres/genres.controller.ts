import {
	Body,
	Controller,
	Delete,
	Get,
	ParseIntPipe,
	Post,
	Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreDto, GenreResponse, UpdateGenreDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
	constructor(private genreService: GenreService) {}

	@Get()
    @ApiOperation({ summary: 'Получить все жанры' })
    @ApiResponse({ 
        status: 200,
        type: [GenreResponse] 
    })
	async getAllGenres(): Promise<GenreResponse[]> {
		return this.genreService.getAllGenres();
	}

	@Post()
    @ApiOperation({ summary: 'Создать новый жанр' })
    @ApiResponse({
        status: 201,
        type: GenreResponse
    })
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
	async createGenre(@Body() body: CreateGenreDto): Promise<GenreResponse> {
		return this.genreService.createGenre(body.name);
	}

	@Delete()
    @ApiOperation({ summary: 'Удалить жанра по ID' })
    @ApiResponse({
        status: 200,
        type: GenreResponse
    })
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
	async deleteGenre(@Query('id', ParseIntPipe) id: number): Promise<GenreResponse> {
		return this.genreService.deleteGenre(id);
	}

	@Put()
    @ApiOperation({ summary: 'Обновить жанр по ID' })
    @ApiResponse({
        status: 200,
        type: GenreResponse
    })
    @Roles('admin')
    @UseGuards(AuthGuard, RolesGuard)
	async updateGenre(@Body() body: UpdateGenreDto): Promise<GenreResponse> {
		return this.genreService.updateGenre(body.id, body.name);
	}
}
