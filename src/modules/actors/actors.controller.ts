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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActorService } from './actors.service';
import {
	ActorResponse,
	CreateActorDto,
	GetAllActorsResponse,
	UpdateActorDto,
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
	async getAllActors(
		@Query('page', ParseIntPipe) page: number = 1,
		@Query('limit') limit: number = 20,
	): Promise<GetAllActorsResponse> {
		const { actors, total } = await this.actorService.getAllActors(
			page,
			limit,
		);

		return {
			data: actors,
			meta: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
			},
		};
	}

	@Post()
	@ApiOperation({ summary: 'Создать актера' })
	@ApiResponse({
		status: 201,
		type: ActorResponse,
	})
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async createActor(@Body() body: CreateActorDto): Promise<ActorResponse> {
		const { fistName, lastName, birthDate, photoUrl } = body;

		return this.actorService.createActor(
			fistName,
			lastName,
			birthDate,
			photoUrl,
		);
	}

	@Put()
	@ApiOperation({ summary: 'Обновить актера' })
	@ApiResponse({
		status: 200,
		type: ActorResponse,
	})
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async updateActor(@Body() body: UpdateActorDto): Promise<ActorResponse> {
		const { id, fistName, lastName, birthDate, photoUrl } = body;

		return this.actorService.updateActor(
			id,
			fistName,
			lastName,
			birthDate,
			photoUrl,
		);
	}

	@Delete()
	@ApiOperation({ summary: 'Удалить актера' })
	@ApiResponse({
		status: 200,
		type: ActorResponse,
	})
	@Roles('admin')
	@UseGuards(AuthGuard, RolesGuard)
	async deleteActor(
		@Query('id', ParseIntPipe) id: number,
	): Promise<ActorResponse> {
		return this.actorService.deleteActor(id);
	}
}
