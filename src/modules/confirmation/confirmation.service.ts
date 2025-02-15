import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { DbService } from 'src/db/db.service';
import { MailService } from './mail.service';
import { SendCodeResponse } from './dto';
import { CONFIRM_SESSION_TIME_LIFE } from 'src/shared/constants';

@Injectable()
export class ConfirmationService {
	private readonly logger = new Logger(ConfirmationService.name);

	constructor(
		private db: DbService,
		private mailService: MailService,
	) {}

	getSalt() {
		return randomBytes(16).toString('hex');
	}

	getHash(code: string, salt: string) {
		return pbkdf2Sync(code, salt, 1000, 64, 'sha512').toString('hex');
	}

	getCode() {
		return Math.random().toString(36).substring(2, 8).toUpperCase();
	}

	async sendCode(
		code: string,
		email: string,
		confirmationType: 'mail' | 'phone' = 'mail',
	) {
		if (confirmationType === 'mail') {
			this.mailService.sendConfirmationCode(email, code);
		}
	}

	async createConfirmationSession(
		code: string,
		timeValid: number,
		userId: number,
	): Promise<SendCodeResponse> {
		const salt = this.getSalt();
		const hash = this.getHash(code, salt);

		const confirmationSession = await this.db.confirmation.create({
			data: {
				code: hash,
				salt,
				timeValid,
				user: {
					connect: {
						id: userId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		return { id: confirmationSession.id, timeValid };
	}

	async codeConfirmations(
		code: string,
		confirmationId: number,
	) {
		const confirmationSession = await this.db.confirmation.findUnique({
			where: {
				id: confirmationId,
			},
		});

		if (!confirmationSession) {
			throw new NotFoundException('Confirmation session not found');
		}

		const isExpired =
			new Date().getTime() - confirmationSession.timeValid >
			confirmationSession.createdAt.getTime();

		if (isExpired) {
			throw new BadRequestException('Confirmation code is expired');
		}

		const hash = this.getHash(code, confirmationSession.salt);
		const isValid = hash === confirmationSession.code;

		if (!isValid) {
			throw new BadRequestException('Confirmation code is not valid');
		}

		return {
			userId: confirmationSession.userId
		}
	}

	async deleteExpiredConfirmationSession() {
		const time = new Date();
		const expirationTime = new Date(time.getTime() - CONFIRM_SESSION_TIME_LIFE);

		this.logger.log(
			`Deleting confirmation session created before: ${expirationTime}`,
		);

		const deletedConfirmationSession =
			await this.db.confirmation.deleteMany({
				where: {
					createdAt: {
						lt: expirationTime,
					},
				},
			});

		this.logger.log(
			`Deleted ${deletedConfirmationSession.count} expired confirmation session`,
		);
	}
}
