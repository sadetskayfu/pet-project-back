import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { CookieService } from './cookie.service';
import { UserModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from './mail.service';
import { UnconfirmedUserModule } from 'src/unconfirmedUsers/unconfirmedUsers.module';
import { ConfirmationCodeService } from './confirmationCode.service';
import { TasksService } from './tasksService';

@Module({
	imports: [UserModule, UnconfirmedUserModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '1d'
        }
    })],
	providers: [AuthService, PasswordService, CookieService, MailService, ConfirmationCodeService, TasksService],
	controllers: [AuthController],
})
export class AuthModule {}
