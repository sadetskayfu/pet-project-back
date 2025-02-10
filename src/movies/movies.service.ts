import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateMovieDto, Cursor } from './dto';
import { GenreService } from 'src/genres/genres.service';
import { MovieSortedBy } from './types';

@Injectable()
export class MovieService {
	private readonly logger = new Logger(MovieService.name);

	constructor(
		private db: DbService,
		private genreService: GenreService,
	) {}

	async findMovieById(id: number) {
		this.logger.log(`Finding movie by ID '${id}'`);

		const movie = await this.db.movie.findUnique({
			where: {
				id,
			},
		});

		this.logger.log(`Found movie: ${JSON.stringify(movie)}`);

		if (!movie) {
			throw new NotFoundException(`Movie with ID '${id}' does not exist`);
		}

		return movie;
	}

	async updateRating(
		movieId: number,
		reviewRating: number,
		isIncrementTotalReviews?: boolean,
		oldReviewRating: number = 0,
	) {
		const movie = await this.findMovieById(movieId);

		this.logger.log(`Updating rating for movie with ID '${movieId}'`);

		const isNeedChangeTotalReviews =
			typeof isIncrementTotalReviews === 'boolean';

		const totalSumRating =
			movie.rating * movie.totalReviews + reviewRating - oldReviewRating;

		const totalReviews =
			movie.totalReviews +
			(isNeedChangeTotalReviews ? (isIncrementTotalReviews ? 1 : -1) : 0);

		const newRating = totalSumRating > 0 ? Number((totalSumRating / totalReviews).toFixed(2)) : 0

		this.logger.log(`New movie rating: ${newRating}`)

		const updatedMovie = await this.db.movie.update({
			where: {
				id: movieId,
			},
			data: {
				rating: newRating,
				totalReviews,
			},
		});

		this.logger.log(`Movie rating updated: ${JSON.stringify(updatedMovie)}`)

		return updatedMovie
	}

	async createMovie(data: CreateMovieDto) {
		const { title, releaseDate, countryCode, duration, genreIds } = data;

		const genres = await this.genreService.findGenresByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

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

		return movie;
	}

	async getMovies(args: {
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
		} = args;

		const orderBy: Record<any, string>[] = [];

		if (sortedBy === 'rating') {
			orderBy.push({ rating: 'desc' }, { id: 'asc' });
		} else if (sortedBy === 'releaseYear') {
			orderBy.push({ releaseYear: 'desc' }, { id: 'asc' });
		} else {
			orderBy.push({ id: 'asc' });
		}

		const movies = await this.db.movie.findMany({
			skip: cursor ? 1 : undefined,
			cursor: cursor
				? {
						id: cursor.id,
						...(sortedBy === 'rating' && {
							rating: cursor.rating,
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
					rating ? { rating: { gte: rating } } : {},
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
						name: true,
					},
				},
				genres: {
					select: {
						genre: true,
					},
				},
			},
			orderBy,
		});

		const nextCursor =
			movies.length === pageSize
				? {
						id: movies[movies.length - 1].id,
						...(sortedBy === 'rating' && {
							rating:
								movies[movies.length - 1].rating,
						}),
						...(sortedBy === 'releaseYear' && {
							releaseYear: movies[movies.length - 1].releaseYear,
						}),
					}
				: null;

		return {
			movies,
			nextCursor,
		};
	}
}
