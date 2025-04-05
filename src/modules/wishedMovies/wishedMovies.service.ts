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
import { WishedMovieResponse } from './dto';

@Injectable()
export class WishedMovieService {
	private readonly logger = new Logger(WishedMovieResponse.name);

	constructor(
		private db: DbService,
	) {}

	async addToWished(
		userId: number,
		movieId: number,
	): Promise<WishedMovieResponse> {
		this.logger.log(
			`Adding movie "${movieId}" to wish list to user "${userId}"`,
		);

		try {
			const addedMovie = await this.db.wishedMovie.create({
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
				`Movie "${movieId}" added to wish list to user ${userId}`,
			);

			return { id: movieId, title: addedMovie.movie.title };
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or movie does not exist');
			}

			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					'This movie has already been added to wish list',
				);
			}

			throw error;
		}
	}

	async removeFormWished(
		userId: number,
		movieId: number,
	): Promise<WishedMovieResponse> {
		this.logger.log(
			`Removing movie "${movieId}" from wish list from user "${userId}"`,
		);

		try {
			const removedMovie = await this.db.wishedMovie.delete({
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
				`Movie "${movieId}" removed from wish list from user ${userId}`,
			);

			return { id: movieId, title: removedMovie.movie.title };
		} catch (error) {
			if (isRecordNotFoundError(error)) {
				throw new NotFoundException('User or movie does not exist');
			}

			if (isUniqueConstraintError(error)) {
				throw new BadRequestException(
					'This movie is not in the wish list',
				);
			}

			throw error;
		}
	}

    async toggleWished(userId: number, movieId: number, isWished: boolean): Promise<WishedMovieResponse> {
        if(isWished) {
            return await this.removeFormWished(userId, movieId)
        } else {
            return await this.addToWished(userId, movieId)
        }
    }
}
