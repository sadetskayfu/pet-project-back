import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { CookieService } from './cookie.service';
import { UserModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { UnconfirmedUserModule } from 'src/modules/unconfirmedUsers/unconfirmedUsers.module';
import { TasksService } from './tasksService';
import { ConfirmationModule } from 'src/modules/confirmation/confirmation.module';

@Module({
	imports: [UserModule, UnconfirmedUserModule, ConfirmationModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '1d'
        }
    })],
	providers: [AuthService, PasswordService, CookieService, TasksService],
	controllers: [AuthController],
})
export class AuthModule {}
