import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movies/movies.module';
import { GenreModule } from './genres/genres.module';

@Module({
	imports: [GenreModule, MovieModule, UserModule, AuthModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
