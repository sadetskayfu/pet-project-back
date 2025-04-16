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
	AuthResponse,
	SessionInfoDto,
	SignInDto,
	SignUpDto,
} from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';
import { CodeConfirmationsDto } from 'src/modules/confirmation/dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
	) {}

	@Post('sign-up')
	@ApiOperation({ summary: 'Регистрация' })
	@ApiResponse({
		status: 201,
		type: AuthResponse
	})
	async signUp(
		@Body() body: SignUpDto,
	): Promise<AuthResponse> {
		return this.authService.signUp(
			body.email,
			body.password,
			body.country,
		);
	}

	@Post('sign-in')
	@ApiOperation({ summary: 'Вход в систему' })
	@ApiResponse({
		status: 200,
		type: AuthResponse
	})
	@HttpCode(HttpStatus.OK)
	async signIn(
		@Body() body: SignInDto,
	): Promise<AuthResponse> {
		return this.authService.signIn(
			body.email,
			body.password,
		);
	}

	@Get('sign-out')
	@UseGuards(AuthGuard)
	@ApiOperation({ summary: 'Выход из системы' })
	signOut(@Res({ passthrough: true }) res: Response) {
		this.cookieService.removeToken(res);
		return 'Вы успешно вышли из своего аккаунта'
	}

	@Get('session')
	@ApiOperation({ summary: 'Получение сессии' })
	@ApiResponse({ status: 200, type: SessionInfoDto })
	@UseGuards(AuthGuard)
	setSessionInfo(@SessionInfo() session: SessionInfoDto) {
		return session;
	}

	@Post('sign-up/confirmation')
	@ApiOperation({ summary: 'Подтвердить регистрацию' })
	@HttpCode(HttpStatus.OK)
	async confirmationSignUp(
		@Res({ passthrough: true }) res: Response,
		@Body() body: CodeConfirmationsDto,
	) {
		const { accessToken } = await this.authService.signUpConfirmations(
			body.code,
			body.confirmationSessionId
		);

		this.cookieService.setToken(res, accessToken);
		return {}
	}

	@Post('sign-in/confirmation')
	@ApiOperation({ summary: 'Подтвердить вход в систему' })
	@HttpCode(HttpStatus.OK)
	async signInConfirmations(
		@Res({ passthrough: true }) res: Response,
		@Body() body: CodeConfirmationsDto,
	) {
		const { accessToken } = await this.authService.signInConfirmations(
			body.code,
			body.confirmationSessionId
		);

		this.cookieService.setToken(res, accessToken);
		return {}
	}
}
