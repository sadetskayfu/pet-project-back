import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateMovieDto, FilterDto, SortingDto, PaginationDto, UpdateMovieDto, MovieResponse, GetMoviesResponse } from './dto';
import { GenreService } from 'src/genres/genres.service';
import { ActorService } from 'src/actors/actors.service';

@Injectable()
export class MovieService {
	private readonly logger = new Logger(MovieService.name);

	constructor(
		private db: DbService,
		private genreService: GenreService,
		private actorService: ActorService
	) {}

	async findMovieById(id: number) {
		this.logger.log(`Finding movie by ID '${id}'`);

		const movie = await this.db.movie.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				totalReviews: true,
				rating: true
			}
		})

		this.logger.log(`Found movie: ${JSON.stringify(movie)}`)

		if(!movie) {
			throw new NotFoundException(`Movie with ID '${id}' does not exist`)
		}

		return movie
	}

	async getMovieById(id: number) {
		this.logger.log(`Finding movie by ID '${id}'`);

		const movie = await this.db.movie.findUnique({
			where: {
				id,
			},
			include: {
				actors: {
					select: {
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true
							}
						}
					}
				},
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true
							}
						}
					}
				}
			}
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
		const { title, description, ageLimit, cardImgUrl, releaseDate, countryCode, duration, genreIds, actorIds } = data;

		const genres = await this.genreService.findManyByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

		const actors = await this.actorService.findManyByIds(actorIds)

		if (actors.length !== actorIds.length) {
			throw new BadRequestException('One or more actors not found.');
		}

		const movie = await this.db.movie.create({
			data: {
				title,
				description,
				ageLimit,
				cardImgUrl,
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
				actors: {
					create: actorIds.map((actorId) => ({
						actor: { connect: { id: actorId } },
					})),
				}
			},
			include: {
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				actors: {
					select: {
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true
							}
						}
					}
				},
				country: true,
			},
		});

		return movie;
	}

	async updateMovie(data: UpdateMovieDto) {
		const { id, title, description, ageLimit, cardImgUrl, releaseDate, countryCode, duration, genreIds, actorIds } = data;

		const genres = await this.genreService.findManyByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

		const actors = await this.actorService.findManyByIds(actorIds)

		if (actors.length !== actorIds.length) {
			throw new BadRequestException('One or more actors not found.');
		}

		await this.db.movie.update({
			where: {
				id,
			},
			data: {
				genres: {
					deleteMany: {}
				},
				actors: {
					deleteMany: {}
				}
			}
		})

		const updatedMovie = await this.db.movie.update({
			where: {
				id,
			},
			data: {
				title,
				description,
				ageLimit,
				cardImgUrl,
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
				actors: {
					create: actorIds.map((actorId) => ({
						actor: { connect: { id: actorId } },
					})),
				}
			},
			include: {
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				actors: {
					select: {
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true
							}
						}
					}
				},
				country: true,
			},
		});

		return updatedMovie;
	}

	async deleteMovie(id: number) {
		await this.findMovieById(id)

		this.logger.log(`Deleting movie with ID '${id}'`)

		const deletedMovie = await this.db.movie.delete({
			where: {
				id
			},
			select: {
				id: true
			}
		})

		this.logger.log(`Movie deleted: ${JSON.stringify(deletedMovie)}`)

		return deletedMovie
	}

	async getMovies(
		filter: FilterDto, pagination: PaginationDto, sorting: SortingDto
	): Promise<GetMoviesResponse> {
		const {title, genres, countries, rating, year} = filter
		const {limit = 40, cursorId, cursorRating, cursorReleaseYear} = pagination
		const {order = 'desc', sort} = sorting

		const genreList = genres?.split('+');
		const countryList = countries?.split('+');

		const orderBy: Record<any, string>[] = [];

		if (sort === 'rating') {
			orderBy.push({ rating: order }, { id: order });
		} else if (sort === 'releaseYear') {
			orderBy.push({ releaseYear: order }, { id: order });
		} else {
			orderBy.push({ id: order });
		}

		const movies = await this.db.movie.findMany({
			skip: cursorId ? 1 : undefined,
			cursor: cursorId
				? {
						id: cursorId,
						...(sort === 'rating' && {
							rating: cursorRating,
						}),
						...(sort === 'releaseYear' && {
							releaseYear: cursorReleaseYear,
						}),
					}
				: undefined,
			take: limit,
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
									some: { genre: { name: { in: genreList } } },
								},
							}
						: {},
					countries ? { countryCode: { in: countryList } } : {},
				],
			},
			select: {
				id: true,
				title: true,
				duration: true,
				country: true,
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true
							}
						}
					}
				},
				rating: true,
				totalReviews: true,
				releaseYear: true,
				cardImgUrl: true
			},
			orderBy: orderBy,
		});

		const nextCursor =
			movies.length === limit
				? {
						id: movies[movies.length - 1].id,
						...(sort === 'rating' && {
							rating:
								movies[movies.length - 1].rating,
						}),
						...(sort === 'releaseYear' && {
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
