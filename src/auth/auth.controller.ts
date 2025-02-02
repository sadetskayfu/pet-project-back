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
import { SessionInfoDto, SignInBodyDto, SignUpBodyDto } from './dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { AuthGuard } from './auth.guard';
import { SessionInfo } from './session-info.decorator';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private cookieService: CookieService,
	) {}

	@Post('sign-up')
	@ApiCreatedResponse()
	async signUp(
		@Body() body: SignUpBodyDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { accessToken } = await this.authService.signUp(
			body.email,
			body.password,
			body.country
		);

		this.cookieService.setToken(res, accessToken);
	}

	@Post('sign-in')
	@ApiOkResponse()
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
	@ApiOkResponse()
	@HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
	signOut(@Res({ passthrough: true }) res: Response) {
		this.cookieService.removeToken(res)
	}

    
	@Get('session')
	@ApiOkResponse({
		type: SessionInfoDto,
	})
    @UseGuards(AuthGuard)
	setSessionInfo(@SessionInfo() session: SessionInfoDto) {
		return session;
	}
}
