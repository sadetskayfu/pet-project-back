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
	UpdateMovieDto,
	MovieResponse,
	MovieForCardResponse,
	GetMoviesResponse,
	DeleteMovieResponse,
} from './dto';
import { GenreService } from 'src/modules/genres/genres.service';
import { ActorService } from 'src/modules/actors/actors.service';

interface Movie {
	id: number;
	title: string;
	releaseYear: number;
	rating: number;
	totalReviews: number;
	duration: number;
	cardImgUrl: string;
	genres: {
		genre: {
			id: number;
			name: string;
		};
	}[];
	country: {
		name: string;
		code: string;
	};
}

@Injectable()
export class MovieService {
	private readonly logger = new Logger(MovieService.name);

	constructor(
		private db: DbService,
		private genreService: GenreService,
		private actorService: ActorService,
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

		return new Set(ratedMovieIds);
	}

	async findWatchedMovies(userId: number): Promise<Set<number>> {
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

		return new Set(watchedMovieIds);
	}

	async findWishlistMovies(userId: number): Promise<Set<number>> {
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
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				country: true,
			},
		});

		this.logger.log(`Found movie: ${JSON.stringify(movie)}`);

		if (!movie) {
			throw new NotFoundException(
				`Movie with ID '${movieId}' does not exist`,
			);
		}

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
			genres: movie.genres.map((g) => ({
				id: g.genre.id,
				name: g.genre.name,
			})),
			actors: movie.actors.map((a) => ({
				id: a.actor.id,
				firstName: a.actor.firstName,
				lastName: a.actor.lastName,
			})),
			isRated: userId ? ratedMovieIds.has(movieId) : false,
			isWatched: userId ? watchedMovieIds.has(movieId) : false,
			isAddedToWishlist: userId
				? addedToWishlistMovieIds.has(movieId)
				: false,
		};

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
			releaseDate,
			countryCode,
			duration,
			genreIds,
			actorIds,
		} = data;

		const genres = await this.genreService.findManyByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

		const actors = await this.actorService.findManyByIds(actorIds);

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
						genreId,
					})),
				},
				actors: {
					create: actorIds.map((actorId) => ({
						actorId,
					})),
				},
			},
			include: {
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				actors: {
					select: {
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				country: true,
			},
		});

		const transformedMovie: MovieResponse = {
			...movie,
			genres: movie.genres.map((g) => ({
				id: g.genre.id,
				name: g.genre.name,
			})),
			actors: movie.actors.map((a) => ({
				id: a.actor.id,
				firstName: a.actor.firstName,
				lastName: a.actor.lastName,
			})),
			isRated: false,
			isWatched: false,
			isAddedToWishlist: false,
		};

		return transformedMovie;
	}

	async updateMovie(data: UpdateMovieDto): Promise<MovieResponse> {
		const {
			id,
			title,
			description,
			ageLimit,
			cardImgUrl,
			releaseDate,
			countryCode,
			duration,
			genreIds,
			actorIds,
		} = data;

		const genres = await this.genreService.findManyByIds(genreIds);

		if (genres.length !== genreIds.length) {
			throw new BadRequestException('One or more genres not found.');
		}

		const actors = await this.actorService.findManyByIds(actorIds);

		if (actors.length !== actorIds.length) {
			throw new BadRequestException('One or more actors not found.');
		}

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
			},
		});

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
						genreId,
					})),
				},
				actors: {
					create: actorIds.map((actorId) => ({
						actorId,
					})),
				},
			},
			include: {
				genres: {
					select: {
						genre: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
				actors: {
					select: {
						actor: {
							select: {
								id: true,
								firstName: true,
								lastName: true,
							},
						},
					},
				},
				country: true,
			},
		});

		const transformedMovie: MovieResponse = {
			...updatedMovie,
			genres: updatedMovie.genres.map((g) => ({
				id: g.genre.id,
				name: g.genre.name,
			})),
			actors: updatedMovie.actors.map((a) => ({
				id: a.actor.id,
				firstName: a.actor.firstName,
				lastName: a.actor.lastName,
			})),
			isRated: false,
			isWatched: false,
			isAddedToWishlist: false,
		};

		return transformedMovie;
	}

	async deleteMovie(id: number): Promise<DeleteMovieResponse> {
		await this.findMovieById(id);

		this.logger.log(`Deleting movie with ID '${id}'`);

		const deletedMovie = await this.db.movie.delete({
			where: {
				id,
			},
			select: {
				id: true,
			},
		});

		this.logger.log(`Movie deleted: ${JSON.stringify(deletedMovie)}`);

		return deletedMovie;
	}

	async transformMovies(movies: Movie[], userId?: number) {
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
				genres: movie.genres.map((g) => ({
					id: g.genre.id,
					name: g.genre.name,
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
			limit = 40,
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
								name: true,
							},
						},
					},
				},
				rating: true,
				totalReviews: true,
				releaseYear: true,
				cardImgUrl: true,
			},
			orderBy: orderBy,
		});

		const transformedMovies = await this.transformMovies(movies, userId)

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
