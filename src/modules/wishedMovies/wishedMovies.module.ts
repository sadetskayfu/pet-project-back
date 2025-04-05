import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { WishedMovieController } from "./wishedMovies.controller";
import { WishedMovieService } from "./wishedMovies.service";

@Module({
    imports: [DbModule],
    providers: [WishedMovieService],
    controllers: [WishedMovieController]
})

export class WishedMovieModule {}