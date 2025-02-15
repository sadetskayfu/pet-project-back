import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { MovieForCardResponse } from "src/modules/movies/dto";
import { MovieService } from "src/modules/movies/movies.service";


@Injectable()
export class WatchedMovieService {
    private readonly logger = new Logger(WatchedMovieService.name);

    constructor(private db: DbService, private movieService: MovieService){}

    async getWatchedMovies(userId: number): Promise<MovieForCardResponse[]> {
        this.logger.log(`Getting watched movies for user '${userId}'`)

        const watchedMovies = await this.db.watchedMovie.findMany({
            where: { userId },
            select: {
                movie: {
                    select: {
                        id: true,
                        title: true,
                        cardImgUrl: true,
                        country: true,
                        duration: true,
                        genres: {
                            select: {
                                genre: {
                                    select: {
                                        name: true,
                                        id: true
                                    }
                                }
                            }
                        },
                        releaseYear: true,
                        rating: true,
                        totalReviews: true
                    }
                },
            },
        });

        const transformedMovies = await this.movieService.transformMovies(watchedMovies.map((movie) => movie.movie), userId)

        this.logger.log(`Resulted movies: ${JSON.stringify(transformedMovies)}`)

        return transformedMovies
    }

    async addToWatched(userId: number, movieId: number) {
        this.logger.log(`Adding movie to watched`)

        try {
            await this.db.watchedMovie.create({
                data: {
                    user: { connect: { id: userId } },
                    movie: { connect: { id: movieId } },
                },
            });

            this.logger.log('Movie added')
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User or movie doest not exist');
            }
            throw error;
        }
    }

    async removeFormWatched(userId: number, movieId: number) {
        this.logger.log(`Removing movie from watched`)

        try {
            await this.db.watchedMovie.delete({
                where: {
                    userId_movieId: {
                        movieId,
                        userId
                    }
                },
            });

            this.logger.log(`Movie removed`)
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('User or movie doest not exist');
            }
            throw error;
        }
    }
}