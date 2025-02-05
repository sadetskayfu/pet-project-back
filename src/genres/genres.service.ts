import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { GenreDto } from './dto';

@Injectable()
export class GenreService {
	constructor(private db: DbService) {}

	async getGenresById(ids: number[]): Promise<GenreDto[]> {
		const genres = await this.db.genre.findMany({
			where: {
				id: { in: ids },
			},
		});

        return genres
	}

	async getGenreById(id: number): Promise<GenreDto> {
		const genre = await this.db.genre.findUnique({
			where: {
				id,
			},
		});

		if (!genre) {
			throw new NotFoundException(`Genre with id ${id} not found.`);
		}

		return genre;
	}

	async getGenreByName(name: string): Promise<GenreDto | null> {
		const genre = await this.db.genre.findUnique({
			where: {
				name,
			},
		});

		return genre;
	}

	async createGenre(name: string): Promise<GenreDto> {
		const existingGenre = await this.getGenreByName(name);

		if (existingGenre) {
			throw new BadRequestException(
				'A genre with that name already exists.',
			);
		}

		const genre = await this.db.genre.create({
			data: {
				name,
			},
		});

		return genre;
	}

	async deleteGenre(id: number): Promise<GenreDto> {
        // Проверка на наличие жанра по id
		await this.getGenreById(id);

		const genre = await this.db.genre.delete({
			where: {
				id,
			},
		});

		return genre;
	}

	async getGenres(): Promise<GenreDto[]> {
		const genres = await this.db.genre.findMany();

		return genres;
	}

	async updateGenre(id: number, name: string): Promise<GenreDto> {
        // Проверка на наличие жанра по id
		await this.getGenreById(id);

		const existingGenre = await this.getGenreByName(name);

		if (existingGenre && existingGenre.id !== id) {
			throw new BadRequestException(
				'A genre with that name already exists',
			);
		}

		const genre = await this.db.genre.update({
			data: {
				name,
			},
			where: {
				id,
			},
		});

		return genre;
	}
}
