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
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActorService } from './actors.service';
import {
	ActorResponse,
	CreateActorDto,
	GetAllActorsResponse,
	PaginationDto,
} from './dto';
import { Roles } from 'src/modules/auth/roles.decorator';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { RolesGuard } from 'src/modules/auth/roles.guard';

@ApiTags('Actors')
@Controller('actors')
export class ActorController {
	constructor(private actorService: ActorService) {}

	@Get()
	@ApiOperation({ summary: 'Получить актеров' })
	@ApiResponse({
		status: 200,
		type: GetAllActorsResponse,
	})
	@ApiQuery({
		name: 'name',
		type: String,
		required: false,
	  })
	@UsePipes(new ValidationPipe({ transform: true }))
	async getAllActors(
		@Query() pagination: PaginationDto,
		@Query('name') name?: string
	): Promise<GetAllActorsResponse> {
		const { actors, nextCursor } = await this.actorService.getAllActors(
			pagination.limit,
			pagination.cursor,
			name
		);

		return {
			data: actors,
			cursor: nextCursor
		};
	}

	@Post()
	@ApiOperation({ summary: 'Создать актера' })
	@ApiResponse({
		status: 201,
		type: ActorResponse,
	})
	//@Roles('admin')
	//@UseGuards(AuthGuard, RolesGuard)
	async createActor(@Body() body: CreateActorDto): Promise<ActorResponse> {
		const { firstName, lastName, birthDate, photoUrl } = body;

		return this.actorService.createActor(
			firstName,
			lastName,
			birthDate,
			photoUrl,
		);
	}

	@Put(':id')
	@ApiOperation({ summary: 'Обновить актера' })
	@ApiResponse({
		status: 200,
		type: ActorResponse,
	})
	//@Roles('admin')
	//@UseGuards(AuthGuard, RolesGuard)
	async updateActor(@Param('id', ParseIntPipe) id: number, @Body() body: CreateActorDto): Promise<ActorResponse> {
		const { firstName, lastName, birthDate, photoUrl } = body;

		return this.actorService.updateActor(
			id,
			firstName,
			lastName,
			birthDate,
			photoUrl,
		);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Удалить актера' })
	@ApiResponse({
		status: 200,
		type: ActorResponse,
	})
	//@Roles('admin')
	//@UseGuards(AuthGuard, RolesGuard)
	async deleteActor(
		@Param('id', ParseIntPipe) id: number,
	): Promise<ActorResponse> {
		return this.actorService.deleteActor(id);
	}
}
