import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
	CreateMovieDto,
	FilterDto,
	SortingDto,
	PaginationDto,
	MovieResponse,
	MovieForCardResponse,
	GetMoviesResponse,
} from './dto';
import { GenreService } from 'src/modules/genres/genres.service';
import { ActorService } from 'src/modules/actors/actors.service';
import { Prisma } from '@prisma/client';

type RawMovie = Prisma.MovieGetPayload<{
	include: {
		genres: {
			select: {
				genre: true;
			};
		};
		actors: {
			select: {
				actor: true;
			};
		};
		countries: {
			select: {
				country: true;
			};
		};
	};
}>;

type RawMovieForCard = Prisma.MovieGetPayload<{
	select: {
		id: true;
		title: true;
		duration: true;
		countries: {
			select: {
				country: true;
			};
		};
		genres: {
			select: {
				genre: true;
			};
		};
		rating: true;
		totalReviews: true;
		releaseYear: true;
		cardImgUrl: true;
	};
}>;

@Injectable()
export class MovieService {
	private readonly logger = new Logger(MovieService.name);

	constructor(private db: DbService) {}

	async findMovieById(id: number) {
		this.logger.log(`Finding movie by ID '${id}'`);

		const movie = await this.db.movie.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				totalReviews: true,
				rating: true,
			},
		});

		this.logger.log(`Found movie: ${JSON.stringify(movie)}`);

		if (!movie) {
			throw new NotFoundException(`Movie with ID '${id}' does not exist`);
		}

		return movie;
	}

	async findRatedMovies(userId: number): Promise<Set<number>> {
		this.logger.log(`Finding rated movies for user with ID '${userId}'`);

		const ratedMovies = await this.db.movie.findMany({
			where: {
				reviews: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const ratedMovieIds = ratedMovies.map((movie) => movie.id);

		this.logger.log(`Found movies: ${JSON.stringify(ratedMovieIds)}`);

		return new Set(ratedMovieIds);
	}

	async findWatchedMovies(userId: number): Promise<Set<number>> {
		this.logger.log(`Finding watched movies for user with ID '${userId}'`);

		const watchedMovies = await this.db.movie.findMany({
			where: {
				watchedBy: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const watchedMovieIds = watchedMovies.map((movie) => movie.id);

		this.logger.log(`Found movies: ${JSON.stringify(watchedMovieIds)}`);

		return new Set(watchedMovieIds);
	}

	async findWishlistMovies(userId: number): Promise<Set<number>> {
		this.logger.log(`Finding wishlist movies for user with ID '${userId}'`);

		const wishlistMovies = await this.db.movie.findMany({
			where: {
				wishListedBy: {
					some: {
						userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		const wishListMovieIds = wishlistMovies.map((movie) => movie.id);

		this.logger.log(`Found movies: ${JSON.stringify(wishListMovieIds)}`);

		return new Set(wishListMovieIds);
	}

	async getMovieById(
		movieId: number,
		userId?: number,
	): Promise<MovieResponse> {
		this.logger.log(`Finding movie by ID '${movieId}'`);

		const movie = await this.db.movie.findUnique({
			where: {
				id: movieId,
			},
			include: {
				actors: {
					select: {
						actor: true,
					},
				},
				genres: {
					select: {
						genre: true,
					},
				},
				countries: {
					select: {
						country: true,
					},
				},
			},
		});

		this.logger.log(`Found movie: ${JSON.stringify(movie)}`);

		if (!movie) {
			throw new NotFoundException(
				`Movie with ID '${movieId}' does not exist`,
			);
		}

		const transformedMovie = await this.transformMovie(movie, userId);

		return transformedMovie;
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

		const newRating =
			totalSumRating > 0
				? Number((totalSumRating / totalReviews).toFixed(2))
				: 0;

		this.logger.log(`New movie rating: ${newRating}`);

		const updatedMovie = await this.db.movie.update({
			where: {
				id: movieId,
			},
			data: {
				rating: newRating,
				totalReviews,
			},
			select: {
				rating: true,
				totalReviews: true,
			},
		});

		this.logger.log(
			`Movie rating updated: ${JSON.stringify(updatedMovie)}`,
		);

		return updatedMovie;
	}

	async createMovie(data: CreateMovieDto): Promise<MovieResponse> {
		const {
			title,
			description,
			ageLimit,
			cardImgUrl,
			videoUrl,
			releaseDate,
			countries,
			duration,
			genres,
			actors,
		} = data;

		try {
			this.logger.log('Creating movie');

			const movie = await this.db.movie.create({
				data: {
					title,
					description,
					ageLimit,
					cardImgUrl,
					videoUrl,
					releaseDate: new Date(releaseDate),
					releaseYear: new Date(releaseDate).getFullYear(),
					duration,
					countries: {
						create: countries.map((countryCode) => ({
							countryCode,
						})),
					},
					genres: {
						create: genres.map((genreId) => ({
							genreId,
						})),
					},
					actors: {
						create: actors.map((actorId) => ({
							actorId,
						})),
					},
				},
				include: {
					genres: {
						select: {
							genre: true,
						},
					},
					actors: {
						select: {
							actor: true,
						},
					},
					countries: {
						select: {
							country: true,
						},
					},
				},
			});

			const transformedMovie = await this.transformMovie(movie);

			this.logger.log(
				`Movie created: ${JSON.stringify(transformedMovie)}`,
			);

			return transformedMovie;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2003'
			) {
				throw new BadRequestException(
					'One or more related entities (countries, genres, actors) not found',
				);
			}

			throw error;
		}
	}

	async updateMovie(
		id: number,
		data: CreateMovieDto,
	): Promise<MovieResponse> {
		const {
			title,
			description,
			ageLimit,
			cardImgUrl,
			videoUrl,
			releaseDate,
			countries,
			duration,
			genres,
			actors,
		} = data;

		await this.db.movie.update({
			where: {
				id,
			},
			data: {
				genres: {
					deleteMany: {},
				},
				actors: {
					deleteMany: {},
				},
				countries: {
					deleteMany: {},
				},
			},
		});

		try {
			this.logger.log(`Updating movie with ID '${id}'`);

			const updatedMovie = await this.db.movie.update({
				where: {
					id,
				},
				data: {
					title,
					description,
					ageLimit,
					cardImgUrl,
					videoUrl,
					releaseDate: new Date(releaseDate),
					releaseYear: new Date(releaseDate).getFullYear(),
					duration,
					countries: {
						create: countries.map((countryCode) => ({
							countryCode,
						})),
					},
					genres: {
						create: genres.map((genreId) => ({
							genreId,
						})),
					},
					actors: {
						create: actors.map((actorId) => ({
							actorId,
						})),
					},
				},
				include: {
					genres: {
						select: {
							genre: true,
						},
					},
					actors: {
						select: {
							actor: true,
						},
					},
					countries: {
						select: {
							country: true,
						},
					},
				},
			});

			const transformedMovie = await this.transformMovie(updatedMovie);

			this.logger.log(
				`Movie updating: ${JSON.stringify(this.transformMovie)}`,
			);

			return transformedMovie;
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2003'
			) {
				throw new BadRequestException(
					'One or more related entities (countries, genres, actors) not found',
				);
			}

			throw error;
		}
	}

	async deleteMovie(id: number): Promise<MovieResponse> {
		await this.findMovieById(id);

		this.logger.log(`Deleting movie with ID '${id}'`);

		const deletedMovie = await this.db.movie.delete({
			where: {
				id,
			},
			include: {
				genres: {
					select: {
						genre: true,
					},
				},
				actors: {
					select: {
						actor: true,
					},
				},
				countries: {
					select: {
						country: true,
					},
				},
			},
		});

		const transformedMovie = await this.transformMovie(deletedMovie);

		this.logger.log(`Movie deleted: ${JSON.stringify(transformedMovie)}`);

		return transformedMovie;
	}

	async transformMovie(movie: RawMovie, userId?: number) {
		let ratedMovieIds: Set<number> = new Set();
		let watchedMovieIds: Set<number> = new Set();
		let addedToWishlistMovieIds: Set<number> = new Set();

		if (userId) {
			[ratedMovieIds, watchedMovieIds, addedToWishlistMovieIds] =
				await Promise.all([
					this.findRatedMovies(userId),
					this.findWatchedMovies(userId),
					this.findWishlistMovies(userId),
				]);
		}

		const transformedMovie: MovieResponse = {
			...movie,
			actors: movie.actors.map((actor) => ({
				id: actor.actor.id,
				firstName: actor.actor.firstName,
				lastName: actor.actor.lastName,
				birthDate: actor.actor.birthDate,
				photoUrl: actor.actor.photoUrl,
			})),
			genres: movie.genres.map((genre) => ({
				id: genre.genre.id,
				name: genre.genre.name,
			})),
			countries: movie.countries.map((country) => ({
				code: country.country.code,
				label: country.country.label,
			})),
			isRated: userId ? ratedMovieIds.has(movie.id) : false,
			isWatched: userId ? watchedMovieIds.has(movie.id) : false,
			isAddedToWishlist: userId
				? addedToWishlistMovieIds.has(movie.id)
				: false,
		};

		return transformedMovie;
	}

	async transformMoviesForCard(movies: RawMovieForCard[], userId?: number) {
		let ratedMovieIds: Set<number> = new Set();
		let watchedMovieIds: Set<number> = new Set();
		let addedToWishlistMovieIds: Set<number> = new Set();

		if (userId) {
			[ratedMovieIds, watchedMovieIds, addedToWishlistMovieIds] =
				await Promise.all([
					this.findRatedMovies(userId),
					this.findWatchedMovies(userId),
					this.findWishlistMovies(userId),
				]);
		}

		const transformedMovies: MovieForCardResponse[] = movies.map(
			(movie) => ({
				...movie,
				genres: movie.genres.map((genre) => ({
					id: genre.genre.id,
					name: genre.genre.name,
				})),
				countries: movie.countries.map((country) => ({
					code: country.country.code,
					label: country.country.label,
				})),
				isRated: userId ? ratedMovieIds.has(movie.id) : false,
				isWatched: userId ? watchedMovieIds.has(movie.id) : false,
				isAddedToWishlist: userId
					? addedToWishlistMovieIds.has(movie.id)
					: false,
			}),
		);

		return transformedMovies;
	}

	async getMovies(
		filter: FilterDto,
		pagination: PaginationDto,
		sorting: SortingDto,
		userId?: number,
	): Promise<GetMoviesResponse> {
		const { title, genres, countries, rating, year } = filter;
		const {
			limit = 20,
			cursorId,
			cursorRating,
			cursorReleaseYear,
		} = pagination;
		const { order = 'desc', sort } = sorting;

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
									some: {
										genre: { name: { in: genreList } },
									},
								},
							}
						: {},
					countries
						? {
								countries: {
									some: {
										country: { code: { in: countryList } },
									},
								},
							}
						: {},
				],
			},
			select: {
				id: true,
				title: true,
				duration: true,
				countries: {
					select: {
						country: true,
					},
				},
				genres: {
					select: {
						genre: true,
					},
				},
				rating: true,
				totalReviews: true,
				releaseYear: true,
				cardImgUrl: true,
			},
			orderBy: orderBy,
		});

		const transformedMovies = await this.transformMoviesForCard(
			movies,
			userId,
		);

		const nextCursor =
			movies.length === limit
				? {
						id: movies[movies.length - 1].id,
						...(sort === 'rating' && {
							rating: movies[movies.length - 1].rating,
						}),
						...(sort === 'releaseYear' && {
							releaseYear: movies[movies.length - 1].releaseYear,
						}),
					}
				: null;

		return {
			data: transformedMovies,
			nextCursor,
		};
	}
}
