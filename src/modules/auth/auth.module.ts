import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { CookieService } from './cookie.service';
import { UserModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfirmationModule } from 'src/modules/confirmation/confirmation.module';
import { ProfileModule } from '../profile/profile.module';

@Module({
	imports: [UserModule, ConfirmationModule, ProfileModule, JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: '1d'
        }
    })],
	providers: [AuthService, PasswordService, CookieService],
	controllers: [AuthController],
})
export class AuthModule {}
