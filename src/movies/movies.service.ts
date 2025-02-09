import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateMovieDto } from './dto';
import { GenreService } from 'src/genres/genres.service';
import { Cursor, MovieSortedBy } from './types';

@Injectable()
export class MovieService {
	constructor(
		private db: DbService,
		private genreService: GenreService,
	) {}

	async create(data: CreateMovieDto) {
		const { title, releaseDate, countryCode, duration, genreIds } = data;

		const genres = await this.genreService.findManyByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

		// Создание фильма
		const movie = await this.db.movie.create({
			data: {
				title,
				releaseData: new Date(releaseDate),
				releaseYear: new Date(releaseDate).getFullYear(),
				duration,
				country: {
					connect: {
						code: countryCode,
					},
				},
				genres: {
					create: genreIds.map((genreId) => ({
						genre: { connect: { id: genreId } },
					})),
				},
			},
			include: {
				genres: { include: { genre: true } },
				country: true,
			},
		});

		//@ts-ignore
		movie.genres = movie.genres.map((genre) => ({
			id: genre.genre.id,
			name: genre.genre.name,
		}));

		return movie;
	}

	async getMovies(filters: {
		title?: string;
		genres?: string[];
		countries?: string[];
		year?: number;
		rating?: number;
		sortedBy?: MovieSortedBy;
		cursor?: Cursor;
		pageSize: number;
	}) {
		const {
			title,
			genres,
			countries,
			year,
			rating,
			cursor,
			sortedBy,
			pageSize,
		} = filters;

		const orderBy: Record<any, string>[] = [];

		if (sortedBy === 'averageRating') {
			orderBy.push({ averageRating: 'desc' }, { id: 'asc' });
		} else if (sortedBy === 'releaseYear') {
			orderBy.push({ releaseYear: 'desc' }, { id: 'asc' });
		} else {
			orderBy.push({ id: 'asc' }); // Сортировка по умолчанию
		}

		const movies = await this.db.movie.findMany({
			skip: cursor ? 1 : undefined,
			cursor: cursor
				? {
						id: cursor.id,
						...(sortedBy === 'averageRating' && {
							averageRating: cursor.averageRating,
						}),
						...(sortedBy === 'releaseYear' && {
							releaseYear: cursor.releaseYear,
						}),
					}
				: undefined,
			take: pageSize,
			where: {
				AND: [
					title
						? { title: { contains: title, mode: 'insensitive' } }
						: {},
					year ? { releaseYear: year } : {},
					rating ? { averageRating: { gte: rating } } : {},
					genres
						? {
								genres: {
									some: { genre: { name: { in: genres } } },
								},
							}
						: {},
					countries ? { countryCode: { in: [] } } : {},
				],
			},
			include: {
				country: {
					select: {
						name: true
					}
				},
				genres: {
					select: {
						genre: true
					}
				}
			},
			orderBy,
		});

		const nextCursor =
			movies.length === pageSize
				? {
						id: movies[movies.length - 1].id,
						...(sortedBy === 'averageRating' && {
							averageRating:
								movies[movies.length - 1].averageRating,
						}),
						...(sortedBy === 'releaseYear' && {
							releaseYear: movies[movies.length - 1].releaseYear,
						}),
					}
				: null;

		return {
			movies,
			nextCursor
		};
	}
}
