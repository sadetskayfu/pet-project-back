import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { UnconfirmedUserService } from 'src/unconfirmedUsers/unconfirmedUsers.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private unconfirmedUserService: UnconfirmedUserService,
		private passwordService: PasswordService,
		private jwtService: JwtService,
		private mailService: MailService,
	) {}

	async sendConfirmationCodeOnEmail(email: string) {
		const code = Math.random().toString(36).substring(2, 8).toUpperCase();

		this.mailService.sendConfirmationCode(email, code);

		return code;
	}

	async updateConfirmationCode(email: string, id: number, isSignUp: boolean) {
		const code = await this.sendConfirmationCodeOnEmail(email)

		if(isSignUp) {
			this.unconfirmedUserService.updateConfirmationCode(id, code)
		} else {
			this.userService.updateConfirmationCode(id, code)
		}
	}

	async signUp(email: string, password: string, country: string) {
		const user = await this.userService.findByEmail(email);

		if (user) {
			throw new BadRequestException(`User with email: ${email} already exists`);
		}

		const unconfirmedUser =
			await this.unconfirmedUserService.findByEmail(email);

		if (unconfirmedUser) {
			await this.unconfirmedUserService.delete(unconfirmedUser.id)
		}

		const salt = this.passwordService.getSalt();
		const hash = this.passwordService.getHash(password, salt);
		const confirmationCode = await this.sendConfirmationCodeOnEmail(email);

		const newUnconfirmedUser = await this.unconfirmedUserService.create(
			email,
			hash,
			salt,
			country,
			confirmationCode,
		);

		const accessToken = await this.jwtService.signAsync({
			id: newUnconfirmedUser.id,
			email: newUnconfirmedUser.email,
			isConfirmed: false
		});

		return { accessToken };
	}

	async confirmationSignUp(id: number, code: string) {
		const unconfirmedUser =
			await this.unconfirmedUserService.findById(id);

		if (!unconfirmedUser) {
			throw new BadRequestException('User not found');
		}

		if (unconfirmedUser.confirmationCode === code) {
			const user = await this.userService.create(
				unconfirmedUser.email,
				unconfirmedUser.hash,
				unconfirmedUser.salt,
				unconfirmedUser.country,
			);

			await this.unconfirmedUserService.delete(unconfirmedUser.id)

			const accessToken = await this.jwtService.signAsync({
				id: user.id,
				email: user.email,
				isConfirmed: true
			});

			return { accessToken }
		} else {
			throw new BadRequestException('Invalid confirmation code');
		}
	}

	async confirmationSignIn(id: number, code: string) {
		const user = await this.userService.findById(id)

		if(!user) {
			throw new UnauthorizedException('The user does not exist');
		}

		if(user.confirmationCode === code) {
			const accessToken = await this.jwtService.signAsync({
				id: user.id,
				email: user.email,
				isConfirmed: true
			});

			return { accessToken }
		} else {
			throw new BadRequestException('Invalid confirmation code');
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

		const accessToken = await this.jwtService.signAsync({
			id: user.id,
			email: user.email,
			isConfirmed: false
		});

		return { accessToken };
	}
}
