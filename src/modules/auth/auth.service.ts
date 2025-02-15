import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { UnconfirmedUserService } from 'src/modules/unconfirmedUsers/unconfirmedUsers.service';
import { ConfirmationService } from 'src/modules/confirmation/confirmation.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private unconfirmedUserService: UnconfirmedUserService,
		private passwordService: PasswordService,
		private jwtService: JwtService,
		private confirmationService: ConfirmationService,
	) {}

	async signUp(email: string, password: string, country: string) {
		const existingUser = await this.userService.findByEmail(email);

		if (existingUser) {
			throw new BadRequestException(`User with email '${email}' already exists`);
		}

		const existingUnconfirmedUser =
			await this.unconfirmedUserService.findByEmail(email);

		if (existingUnconfirmedUser) {
			await this.unconfirmedUserService.delete(existingUnconfirmedUser.id)
		}

		const salt = this.passwordService.getSalt();
		const hash = this.passwordService.getHash(password, salt);

		const unconfirmedUser = await this.unconfirmedUserService.create(
			email,
			hash,
			salt,
			country,
		);

		return {
			userId: unconfirmedUser.id
		}
	}

	async signIn(email: string, password: string) {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('The user does not exist');
		}

		const hash = this.passwordService.getHash(password, user.salt);

		if (hash !== user.hash) {
			throw new UnauthorizedException('The user does not exist');
		}

		return { userId: user.id }
	}

	async signUpConfirmations(code: string, confirmationSessionId: number) {
		const confirmationSession = await this.confirmationService.codeConfirmations(code, confirmationSessionId)

		const unconfirmedUser = await this.unconfirmedUserService.findById(confirmationSession.userId)

		if(!unconfirmedUser) {
			throw new NotFoundException(`User with id ${confirmationSession.userId} not found`)
		}

		const user = await this.userService.create(
			unconfirmedUser.email,
			unconfirmedUser.hash,
			unconfirmedUser.salt,
			unconfirmedUser.countryCode,
		);

		await this.unconfirmedUserService.delete(unconfirmedUser.id)

		const accessToken = await this.jwtService.signAsync({
			id: user.id,
			email: user.email,
			roles: user.roles,
		});

		return { accessToken }
	}

	async signInConfirmations(code: string, confirmationSessionId: number) {
		const confirmationSession = await this.confirmationService.codeConfirmations(code, confirmationSessionId)

		const user = await this.userService.findById(confirmationSession.userId)

		if(!user) {
			throw new NotFoundException(`User with id ${confirmationSession.userId} not found`)
		}

		const accessToken = await this.jwtService.signAsync({
			id: user.id,
			email: user.email,
			roles: user.roles,
		});

		return { accessToken }
	}
}
