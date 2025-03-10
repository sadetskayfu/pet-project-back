import { Module } from "@nestjs/common";
import { MovieService } from "./movies.service";
import { DbModule } from "src/db/db.module";
import { MovieController } from "./movies.controller";
import { GenreModule } from "src/modules/genres/genres.module";
import { ActorModule } from "src/modules/actors/actors.module";

@Module({
    imports: [DbModule, GenreModule, ActorModule],
    providers: [MovieService],
    exports: [MovieService],
    controllers: [MovieController]
})

export class MovieModule {}