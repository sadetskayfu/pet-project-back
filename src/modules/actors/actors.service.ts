import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateActorDto } from './dto';

@Injectable()
export class ActorService {
	private readonly logger = new Logger(ActorService.name);

	constructor(private db: DbService) {}

	async findManyByIds(ids: number[]) {
		this.logger.log(`Finding actors by IDs: ${JSON.stringify(ids)}`);

		const actors = await this.db.actor.findMany({
			where: {
				id: { in: ids },
			},
			select: {
				id: true,
			},
		});

		this.logger.log(`Found actors: ${JSON.stringify(actors)}`);

		return actors;
	}

	async findActorById(id: number) {
		this.logger.log(`Finding actor by ID "${id}"`);

		const actor = await this.db.actor.findUnique({
			where: {
				id,
			},
		});

		this.logger.log(`Found actor: ${JSON.stringify(actor)}`);

		if (!actor) {
			throw new NotFoundException(`Actor with ID '${id}' not found`);
		}

		return actor;
	}

	async findActor(firstName: string, lastName: string, birthDate: string) {
		this.logger.log(
			`Finding actor by name '${firstName} ${lastName}' and birthDate '${birthDate}'`,
		);

		const actor = await this.db.actor.findFirst({
			where: {
				firstName,
				lastName,
				birthDate: new Date(birthDate),
			},
		});

		this.logger.log(`Found actor: ${JSON.stringify(actor)}`);

		return actor;
	}

	async createActor(
		data: CreateActorDto
	) {
		const { firstName, lastName, photoUrl, birthDate } = data

		const existingActor = await this.findActor(
			firstName,
			lastName,
			birthDate,
		);

		if (existingActor) {
			throw new BadRequestException(
				`Actor ${firstName} ${lastName} born on '${birthDate}' already exists`,
			);
		}

		this.logger.log(
			`Creating actor '${firstName} ${lastName} born on ${birthDate}'`,
		);

		const actor = await this.db.actor.create({
			data: {
				firstName,
				lastName,
				birthDate: new Date(birthDate),
				photoUrl,
			},
		});

		this.logger.log(`Actor created: ${JSON.stringify(actor)}`);

		return actor;
	}

	async deleteActor(id: number) {
		await this.findActorById(id);

		this.logger.log(`Deleting actor by ID '${id}'`);

		const actor = await this.db.actor.delete({
			where: {
				id,
			},
		});

		this.logger.log(`Actor deleted: ${JSON.stringify(actor)}`);

		return actor;
	}

	async updateActor(
		id: number,
		data: CreateActorDto
	) {
		const {firstName, lastName, birthDate, photoUrl} = data

		await this.findActorById(id);

		const existingActor = await this.findActor(
			firstName,
			lastName,
			birthDate,
		);

		if (existingActor && existingActor.id !== id) {
			throw new BadRequestException(
				`Actor '${firstName} ${lastName}' born on '${birthDate}' already exists`,
			);
		}

		this.logger.log(`Updating actor with ID '${id}'`);

		const actor = await this.db.actor.update({
			data: {
				firstName,
				lastName,
				birthDate: new Date(birthDate),
				photoUrl,
			},
			where: {
				id,
			},
		});

		this.logger.log(`Actor updated: ${JSON.stringify(actor)}`);

		return actor;
	}

	async getAllActors(limit: number = 20, cursor?: number, name?: string) {
		this.logger.log(`Getting actors, current cursor: ${cursor}'`);

		const actors = await this.db.actor.findMany({
			skip: cursor ? 1 : undefined,
			cursor: cursor ? { id: cursor } : undefined,
			take: limit,
			where: name
				? {
						OR: [
							name
								? {
										firstName: {
											contains: name,
											mode: 'insensitive',
										},
									}
								: {},
							name
								? {
										lastName: {
											contains: name,
											mode: 'insensitive',
										},
									}
								: {},
						],
					}
				: undefined,
			orderBy: {
				id: 'desc',
			},
		});

		const nextCursor =
			actors.length === limit ? actors[actors.length - 1].id : null;

		this.logger.log(
			`Resulting actors: ${JSON.stringify(actors)}, next cursor: ${nextCursor}`,
		);

		return {
			actors,
			nextCursor,
		};
	}

	async getActorsForMovie(movieId: number) {
		const actors = await this.db.actor.findMany({
			where: {
				movies: {
					some: {
						movieId
					}
				}
			}
		})

		return actors
	}
}
