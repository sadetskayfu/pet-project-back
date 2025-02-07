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
	SessionInfoDto,
	SignInBodyDto,
	SignUpBodyDto,
} from './dto';
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
	@ApiResponse({ status: 201, description: 'Enter the code' })
	@ApiResponse({ status: 400, description: 'The user with this email already exists' })
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
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Вход в систему' })
	@ApiResponse({ status: 200, description: 'Enter the code' })
	@ApiResponse({ status: 401, description: 'The user does not exist' })
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
	@ApiResponse({ status: 200, description: 'You have successfully logged out' })
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	signOut(@Res({ passthrough: true }) res: Response) {
		this.cookieService.removeToken(res);
	}

	@Get('session')
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Получение сессии' })
	@ApiResponse({ status: 200, description: 'You have successfully logged in', type: SessionInfo })
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	setSessionInfo(@SessionInfo() session: SessionInfoDto) {
		return session;
	}

	@Get('sign-in/update-confirmation-code')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Обновить проверочный код для входа в систему' })
	@ApiResponse({ status: 200, description: 'Confirmation code has been successfully updated'})
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	async updateConfirmationSignInCode(@SessionInfo() session: SessionInfoDto) {
		this.authService.updateConfirmationCode(
			session.email,
			session.id,
			false,
		);
	}

	@Get('sign-up/update-confirmation-code')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Обновить проверочный код для регистрации' })
	@ApiResponse({ status: 200, description: 'Confirmation code has been successfully updated'})
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	async updateConfirmationSignUpCode(@SessionInfo() session: SessionInfoDto) {
		this.authService.updateConfirmationCode(
			session.email,
			session.id,
			true,
		);
	}

	@Post('sign-up/confirmation')
	@UseGuards(ConfirmationAuthGuard)
	@ApiOperation({ summary: 'Подтвердить регистрацию' })
	@ApiResponse({ status: 201, description: 'You have successfully registered'})
	@ApiResponse({ status: 400, description: 'The user does not exist or invalid confirmation code'})
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	async confirmationSignUp(
		@Res({ passthrough: true }) res: Response,
		@SessionInfo() session: SessionInfoDto,
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
	@ApiResponse({ status: 200, description: 'You have successfully logged in'})
	@ApiResponse({ status: 400, description: 'The user does not exist or invalid confirmation code'})
	@ApiResponse({ status: 401, description: 'You are not authorization' })
	async confirmationSingIn(
		@Res({ passthrough: true }) res: Response,
		@SessionInfo() session: SessionInfoDto,
		@Body() body: ConfirmationBodyDto,
	) {
		const { accessToken } = await this.authService.confirmationSignIn(
			session.id,
			body.code,
		);

		this.cookieService.setToken(res, accessToken);
	}
}
