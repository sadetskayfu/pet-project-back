import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { GenreService } from './genres.service';
import { CreateGenreDto, GenreResponse } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';
import { Roles } from 'src/modules/auth/roles.decorator';

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
	async getAll(): Promise<GenreResponse[]> {
		return this.genreService.getAll();
	}

	@Post()
    @ApiOperation({ summary: 'Создать новый жанр' })
    @ApiResponse({
        status: 201,
        type: GenreResponse
    })
    //@Roles('admin')
    //@UseGuards(AuthGuard, RolesGuard)
	async create(@Body() body: CreateGenreDto): Promise<GenreResponse> {
		return this.genreService.create(body.name);
	}

	@Delete(':id')
    @ApiOperation({ summary: 'Удалить жанра по ID' })
    @ApiResponse({
        status: 200,
        type: GenreResponse
    })
    //@Roles('admin')
    //@UseGuards(AuthGuard, RolesGuard)
	async delete(@Param('id', ParseIntPipe) id: number): Promise<GenreResponse> {
		return this.genreService.delete(id);
	}

	@Put(':id')
    @ApiOperation({ summary: 'Обновить жанр по ID' })
    @ApiResponse({
        status: 200,
        type: GenreResponse
    })
    //@Roles('admin')
    //@UseGuards(AuthGuard, RolesGuard)
	async update(@Param('id', ParseIntPipe) id: number, @Body() body: CreateGenreDto): Promise<GenreResponse> {
		return this.genreService.update(id, body.name);
	}
}
