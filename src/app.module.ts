import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieModule } from './modules/movies/movies.module';
import { GenreModule } from './modules/genres/genres.module';
import { RoleModule } from './modules/roles/roles.module';
import { CountryModule } from './modules/countries/countries.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewModule } from './modules/reviews/reviews.module';
import { ActorModule } from './modules/actors/actors.module';
import { CommentModule } from './modules/comments/comments.module';
import { ProfileModule } from './modules/profile/profile.module';
//import { RedisModule } from './modules/redis/redis.module';
import { ConfirmationModule } from './modules/confirmation/confirmation.module';
import { WatchedMovieModule } from './modules/watchedMovies/watchedMovies.module';
import { WishedMovieModule } from './modules/wishedMovies/wishedMovies.module';
import { ConfigModule } from '@nestjs/config';
import { MediaModule } from './modules/media/media.module';

@Module({
	imports: [
		//RedisModule,
		MediaModule,
		GenreModule,
		MovieModule,
		WatchedMovieModule,
		WishedMovieModule,
		UserModule,
		ConfirmationModule,
		ProfileModule,
		CountryModule,
		RoleModule,
		AuthModule,
		ActorModule,
		ReviewModule,
		CommentModule,
		ScheduleModule.forRoot(),
		ConfigModule.forRoot({
			isGlobal: true
		})
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
