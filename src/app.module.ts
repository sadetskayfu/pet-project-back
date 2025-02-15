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
import { ReviewLikeModule } from './modules/reviewLikes/reviewLikes.module';
import { CommentModule } from './modules/comments/comments.module';
import { CommentLikeModule } from './modules/commentLikes/commentLikes.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RedisModule } from './modules/redis/redis.module';
import { ConfirmationModule } from './modules/confirmation/confirmation.module';

@Module({
	imports: [
		RedisModule,
		GenreModule,
		MovieModule,
		UserModule,
		ConfirmationModule,
		ProfileModule,
		CountryModule,
		RoleModule,
		AuthModule,
		ActorModule,
		ReviewModule,
		ReviewLikeModule,
		CommentModule,
		CommentLikeModule,
		ScheduleModule.forRoot(),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
