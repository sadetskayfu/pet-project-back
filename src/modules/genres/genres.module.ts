import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { GenreService } from "./genres.service";
import { GenreController } from "./genres.controller";

@Module({
    imports: [DbModule],
    providers: [GenreService],
    exports: [GenreService],
    controllers: [GenreController]
})

export class GenreModule {}