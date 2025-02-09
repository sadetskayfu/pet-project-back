import {
	BadRequestException,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { UnconfirmedUserService } from 'src/unconfirmedUsers/unconfirmedUsers.service';
import { ConfirmationCodeService } from './confirmationCode.service';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		private userService: UserService,
		private unconfirmedUserService: UnconfirmedUserService,
		private passwordService: PasswordService,
		private jwtService: JwtService,
		private confirmationCodeService: ConfirmationCodeService,
		private mailService: MailService
	) {}

	async updateConfirmationCode(email: string, id: number, isSignUp: boolean) {
		const {code, codeExpiresAt} = this.confirmationCodeService.getCode()

		await this.mailService.sendConfirmationCode(email, code)

		if(isSignUp) {
			this.unconfirmedUserService.updateConfirmationCode(id, code, codeExpiresAt)
		} else {
			this.userService.updateConfirmationCode(id, code, codeExpiresAt)
		}
	}

	async signUp(email: string, password: string, country: string) {
		const user = await this.userService.findByEmail(email);

		if (user) {
			throw new BadRequestException(`User with email '${email}' already exists`);
		}

		const unconfirmedUser =
			await this.unconfirmedUserService.findByEmail(email);

		if (unconfirmedUser) {
			await this.unconfirmedUserService.delete(unconfirmedUser.id)
		}

		const salt = this.passwordService.getSalt();
		const hash = this.passwordService.getHash(password, salt);
		const {code, codeExpiresAt} = this.confirmationCodeService.getCode()

		await this.mailService.sendConfirmationCode(email, code)

		const newUnconfirmedUser = await this.unconfirmedUserService.create(
			email,
			hash,
			salt,
			country,
			code,
			codeExpiresAt
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

		const isExpired = this.confirmationCodeService.checkOnExpired(unconfirmedUser.confirmationCodeExpiresAt)

		if (!isExpired && unconfirmedUser.confirmationCode === code) {
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
			throw new UnauthorizedException('User does not exist');
		}

		const isExpired = this.confirmationCodeService.checkOnExpired(user.confirmationCodeExpiresAt)

		if(!isExpired && user.confirmationCode === code) {
			await this.userService.updateConfirmationCode(id, null, null)

			const accessToken = await this.jwtService.signAsync({
				id: user.id,
				email: user.email,
				roles: user.roles,
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

		const {code, codeExpiresAt} = this.confirmationCodeService.getCode();

		await this.mailService.sendConfirmationCode(email, code)

		await this.userService.updateConfirmationCode(user.id, code, codeExpiresAt)

		const accessToken = await this.jwtService.signAsync({
			id: user.id,
			email: user.email,
			isConfirmed: false
		});

		return { accessToken };
	}
}
