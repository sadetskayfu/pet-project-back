import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { DbService } from 'src/db/db.service';
import { MailService } from './mail.service';
import { SendCodeResponse } from './dto';
import { CONFIRM_SESSION_TIME_LIFE } from 'src/shared/constants';
import { UserService } from '../users/users.service';

@Injectable()
export class ConfirmationService {
	private readonly logger = new Logger(ConfirmationService.name);

	constructor(
		private db: DbService,
		private mailService: MailService,
		@Inject(forwardRef(() => UserService))
		private userService: UserService
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

	async sendAuthCode(userId: number, code: string, confirmationType: 'mail' | 'phone' = 'mail',) {
		const user = await this.userService.findById(userId)

		if(!user) {
			throw new NotFoundException(`User with id ${userId} does not exist`)
		}

		if(confirmationType === 'mail') {
			await this.mailService.sendConfirmationCode(user.email, code)
		}
	}

	async sendCode(
		code: string,
		email: string,
		confirmationType: 'mail' | 'phone' = 'mail',
	) {
		if (confirmationType === 'mail') {
			await this.mailService.sendConfirmationCode(email, code);
		}
	}

	async createConfirmationSession(
		code: string,
		codeTimeValid: number,
		userId: number,
	): Promise<SendCodeResponse> {
		const salt = this.getSalt();
		const hash = this.getHash(code, salt);

		const confirmationSession = await this.db.confirmation.create({
			data: {
				code: hash,
				salt,
				timeValid: codeTimeValid,
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

		return { confirmationSessionid: confirmationSession.id, codeTimeValid };
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
		this.logger.log(hash, confirmationSession.code)

		if (!isValid) {
			throw new BadRequestException('Confirmation code is not valid');
		}

		return {
			userId: confirmationSession.userId
		}
	}

	async deleteConfirmationSessionsByUserId (userId: number) {
		this.logger.log(
			`Deleting confirmation sessions by userId '${userId}'`,
		);

		const deletingSessions = await this.db.confirmation.deleteMany({
			where: {
				userId,
			},
		})

		this.logger.log(`${deletingSessions.count} confirmation session deleted`)
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
