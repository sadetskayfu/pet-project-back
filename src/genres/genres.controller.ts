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
    UseGuards,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreBodyDto, GenreDto, UpdateGenreBodyDto } from './dto';
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
        type: [GenreDto] 
    })
	async getAll() {
		return this.genreService.getAll();
	}

	@Post()
    @ApiOperation({ summary: 'Создать новый жанр' })
    @ApiResponse({
        status: 201,
        type: [GenreDto]
    })
    @Roles('admin')
    @UseGuards(RolesGuard, AuthGuard)
	async create(@Body() body: CreateGenreBodyDto) {
		return this.genreService.create(body.name);
	}

	@Delete(':id')
    @ApiOperation({ summary: 'Удалить жанра по ID' })
    @ApiResponse({
        status: 200,
        type: [GenreDto]
    })
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(RolesGuard, AuthGuard)
	async delete(@Param('id') id: string) {
		const numberId = parseInt(id);

		return this.genreService.delete(numberId);
	}

	@Put()
    @ApiOperation({ summary: 'Обновить жанр по ID' })
    @ApiResponse({
        status: 200,
        type: [GenreDto]
    })
    @HttpCode(HttpStatus.OK)
    @Roles('admin')
    @UseGuards(RolesGuard, AuthGuard)
	async update(@Body() body: UpdateGenreBodyDto) {
		return this.genreService.update(body.id, body.name);
	}
}
