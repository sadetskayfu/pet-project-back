import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movies/movies.module';
import { GenreModule } from './genres/genres.module';
import { RoleModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import authConfig from './config/auth.config';
import { CountryModule } from './countries/countries.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
	imports: [
		GenreModule,
		MovieModule,
		UserModule,
		CountryModule,
		RoleModule,
		AuthModule,
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [authConfig],
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
