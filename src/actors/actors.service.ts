import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

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
				id: true
			}
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
		this.logger.log(`Finding actor by name '${firstName} ${lastName}' and birthDate '${birthDate}'`);

		const actor = await this.db.actor.findFirst({
			where: {
				firstName,
                lastName,
                birthDate: new Date(birthDate)
			},
		});

		this.logger.log(`Found actor: ${JSON.stringify(actor)}`);

		return actor;
	}

	async createActor(firstName: string, lastName: string, birthDate: string, photoUrl?: string) {
		const existingActor = await this.findActor(firstName, lastName, birthDate);

		if (existingActor) {
			throw new BadRequestException(`Actor ${firstName} ${lastName} born on '${birthDate}' already exists`);
		}

		this.logger.log(`Creating actor '${firstName} ${lastName} born on ${birthDate}'`);

		const actor = await this.db.actor.create({
			data: {
				firstName,
                lastName,
                birthDate: new Date(birthDate),
                photoUrl
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

	async updateActor(id: number, firstName: string, lastName: string, birthDate: string, photoUrl?: string) {
		await this.findActorById(id);

        const existingActor = await this.findActor(firstName, lastName, birthDate)

		if (existingActor && existingActor.id !== id) {
			throw new BadRequestException(`Actor '${firstName} ${lastName}' born on '${birthDate}' already exists`);
		}

		this.logger.log(`Updating actor with ID '${id}'`);

		const actor = await this.db.actor.update({
			data: {
				firstName,
                lastName,
                birthDate,
                photoUrl
			},
			where: {
				id,
			},
		});

		this.logger.log(`Actor updated: ${JSON.stringify(actor)}`);

		return actor;
	}

	async getAllActors(page: number, limit: number) {
        const skip = (page - 1) * limit;

		this.logger.log(`Getting actors, page '${page}'`);

		const actors = await this.db.actor.findMany({
            skip,
            take: limit
        });

		this.logger.log(`Resulting actors: ${JSON.stringify(actors)}`);

		return {
            actors,
            total: await this.db.actor.count()
        };
	}
}
