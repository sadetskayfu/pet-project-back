import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class GenreService {
	private readonly logger = new Logger(GenreService.name);

	constructor(private db: DbService) {}

	async findManyByIds(ids: number[]) {
		this.logger.log(`Finding genres by IDs: ${JSON.stringify(ids)}`);

		const genres = await this.db.genre.findMany({
			where: {
				id: { in: ids },
			},
			select: {
				id: true
			}
		});

		this.logger.log(`Found genres: ${JSON.stringify(genres)}`);

		return genres;
	}

	async findById(id: number) {
		this.logger.log(`Finding genre by ID "${id}"`);

		const genre = await this.db.genre.findUnique({
			where: {
				id,
			},
		});

		this.logger.log(`Found genre: ${JSON.stringify(genre)}`);

		if (!genre) {
			throw new NotFoundException(`Genre with ID '${id}' not found`);
		}

		return genre;
	}

	async findByName(name: string) {
		this.logger.log(`Finding genre by name '${name}'`);

		const genre = await this.db.genre.findUnique({
			where: {
				name,
			},
		});

		this.logger.log(`Found genre: ${JSON.stringify(genre)}`);

		return genre;
	}

	async create(genreName: string) {
		const name = genreName.toLowerCase();
		const existingGenre = await this.findByName(name);

		if (existingGenre) {
			throw new BadRequestException(`Genre '${name}' already exists`);
		}

		this.logger.log(`Creating genre '${name}'`);

		const genre = await this.db.genre.create({
			data: {
				name,
			},
		});

		this.logger.log(`Genre created: ${JSON.stringify(genre)}`);

		return genre;
	}

	async delete(id: number) {
		await this.findById(id);

		this.logger.log(`Deleting genre by ID '${id}'`);

		const genre = await this.db.genre.delete({
			where: {
				id,
			},
		});

		this.logger.log(`Genre deleted: ${JSON.stringify(genre)}`);

		return genre;
	}

	async update(id: number, genreName: string) {
		await this.findById(id);

		const name = genreName.toLowerCase();
		const existingGenre = await this.findByName(name);

		if (existingGenre && existingGenre.id !== id) {
			throw new BadRequestException(`Genre '${name}' already exists`);
		}

		this.logger.log(`Updating genre with ID '${id}'`);

		const genre = await this.db.genre.update({
			data: {
				name,
			},
			where: {
				id,
			},
		});

		this.logger.log(`Genre updated: ${JSON.stringify(genre)}`);

		return genre;
	}

	async getAll() {
		this.logger.log('Getting all genres');

		const genres = await this.db.genre.findMany();

		this.logger.log(`Resulting genres: ${JSON.stringify(genres)}`);

		return genres;
	}
}
