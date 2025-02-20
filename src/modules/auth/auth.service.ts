import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfirmationService } from 'src/modules/confirmation/confirmation.service';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private passwordService: PasswordService,
		private jwtService: JwtService,
		private confirmationService: ConfirmationService,
		private profileService: ProfileService,
	) {}

	async signUp(email: string, password: string, country: string) {
		const existingUser = await this.userService.findByEmail(email);

		if (existingUser && existingUser.isConfirmed) {
			throw new BadRequestException(`User with email '${email}' already exists`);
		}

		if (existingUser && !existingUser.isConfirmed) {
			await this.userService.delete(existingUser.id)
		}

		const salt = this.passwordService.getSalt();
		const hash = this.passwordService.getHash(password, salt);

		const user = await this.userService.create(
			email,
			hash,
			salt,
			country,
		);

		return {
			userId: user.id
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

		const user = await this.userService.findById(confirmationSession.userId)

		if(!user) {
			throw new NotFoundException(`User with id ${confirmationSession.userId} not found`)
		}

		await this.userService.setConfirmed(user.id)
		await this.profileService.createProfile(user.id)
		await this.confirmationService.deleteConfirmationSessionsByUserId(user.id)

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

		await this.confirmationService.deleteConfirmationSessionsByUserId(user.id)

		const accessToken = await this.jwtService.signAsync({
			id: user.id,
			email: user.email,
			roles: user.roles,
		});

		return { accessToken }
	}
}
