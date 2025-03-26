import { Module } from "@nestjs/common";
import { MovieService } from "./movies.service";
import { DbModule } from "src/db/db.module";
import { MovieController } from "./movies.controller";

@Module({
    imports: [DbModule],
    providers: [MovieService],
    exports: [MovieService],
    controllers: [MovieController]
})

export class MovieModule {}