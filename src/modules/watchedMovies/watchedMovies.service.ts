import {
	BadRequestException,
	Injectable,
	Logger,
    NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
	isRecordNotFoundError,
	isUniqueConstraintError,
} from 'src/shared/helpers/errors/prisma-errors';
import { WatchedMovieResponse } from './dto';

@Injectable()
export class WatchedMovieService {
	private readonly logger = new Logger(WatchedMovieService.name);

	constructor(
		private db: DbService,
	) {}

	async addToWatched(
		userId: number,
		movieId: number,
	): Promise<WatchedMovieResponse> {
		this.logger.log(
			`Adding movie "${movieId}" to watched list to user "${userId}"`,
		);

		try {
			const addedMovie = await this.db.watchedMovie.create({
				data: {
					user: { connect: { id: userId } },
					movie: { connect: { id: movieId } },
				},
				select: {
					movie: {
						select: {
							title: true,
						},
					},
				},
			});

			this.logger.log(
				`Movie "${movieId}" added to watched list to user ${userId}`,
			);

			return { id: movieId, title: addedMovie.movie.title };
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or movie does not exist');
			}

			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					'This movie has already been added to the watched list',
				);
			}

			throw error;
		}
	}

	async removeFormWatched(
		userId: number,
		movieId: number,
	): Promise<WatchedMovieResponse> {
		this.logger.log(
			`Removing movie "${movieId}" from watched list from user "${userId}"`,
		);

		try {
			const removedMovie = await this.db.watchedMovie.delete({
				where: {
					userId_movieId: {
						movieId,
						userId,
					},
				},
				select: {
					movie: {
						select: {
							title: true,
						},
					},
				},
			});

			this.logger.log(
				`Movie "${movieId}" removed from watched list from user ${userId}`,
			);

			return { id: movieId, title: removedMovie.movie.title };
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or movie does not exist');
			}

			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					'This movie is not in the watched list',
				);
			}

			throw error;
		}
	}

    async toggleWatched(userId: number, movieId: number, isWatched: boolean): Promise<WatchedMovieResponse> {
        if(isWatched) {
            return await this.removeFormWatched(userId, movieId)
        } else {
            return await this.addToWatched(userId, movieId)
        }
    }
}
