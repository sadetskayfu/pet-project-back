import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { WatchedMovieService } from "./watchedMovies.service";
import { WatchedMovieController } from "./watchedMovies.controller";

@Module({
    imports: [DbModule],
    providers: [WatchedMovieService],
    controllers: [WatchedMovieController]
})

export class WatchedMovieModule {}