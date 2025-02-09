import {
	Controller,
	Post,
	Get,
	HttpCode,
	HttpStatus,
	Body,
	Res,
	UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import {
	ConfirmationBodyDto,
	ConfirmationSessionInfoDto,
	SessionInfoDto,
	SignInBodyDto,
	SignUpBodyDto,
} from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';
import { ConfirmationAuthGuard } from './confirmationAuth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
	) {}

	@Post('sign-up')
	@ApiOperation({ summary: 'Регистрация' })
	async signUp(
		@Body() body: SignUpBodyDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken } = await this.authService.signUp(
			body.email,
			body.password,
			body.country,
		);

		this.cookieService.setToken(res, accessToken);
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'Вход в систему' })
	@HttpCode(HttpStatus.OK)
	async signIn(
		@Body() body: SignInBodyDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken } = await this.authService.signIn(
			body.email,
			body.password,
		);

		this.cookieService.setToken(res, accessToken);
	}

	@Get('sign-out')
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Выход из системы' })
	signOut(@Res({ passthrough: true }) res: Response) {
		this.cookieService.removeToken(res);
	}

	@Get('session')
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Получение сессии' })
	@ApiResponse({ status: 200, type: [SessionInfoDto] })
	setSessionInfo(@SessionInfo() session: SessionInfoDto) {
		return session;
	}

	@Get('sign-in/update-confirmation-code')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Обновить проверочный код для входа в систему' })
	async updateConfirmationSignInCode(@SessionInfo() session: ConfirmationSessionInfoDto) {
		this.authService.updateConfirmationCode(
			session.email,
			session.id,
			false,
		);
	}

	@Get('sign-up/update-confirmation-code')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Обновить проверочный код для регистрации' })
	async updateConfirmationSignUpCode(@SessionInfo() session: ConfirmationSessionInfoDto) {
		this.authService.updateConfirmationCode(
			session.email,
			session.id,
			true,
		);
	}

	@Post('sign-up/confirmation')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Подтвердить регистрацию' })
	async confirmationSignUp(
		@Res({ passthrough: true }) res: Response,
		@SessionInfo() session: ConfirmationSessionInfoDto,
		@Body() body: ConfirmationBodyDto,
	) {
		const { accessToken } = await this.authService.confirmationSignUp(
			session.id,
			body.code,
		);

		this.cookieService.setToken(res, accessToken);
	}

	@Post('sign-in/confirmation')
	@UseGuards(ConfirmationAuthGuard)
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Подтвердить вход в систему' })
	async confirmationSingIn(
		@Res({ passthrough: true }) res: Response,
		@SessionInfo() session: ConfirmationSessionInfoDto,
		@Body() body: ConfirmationBodyDto,
	) {
		const { accessToken } = await this.authService.confirmationSignIn(
			session.id,
			body.code,
		);

		this.cookieService.setToken(res, accessToken);
	}
}
