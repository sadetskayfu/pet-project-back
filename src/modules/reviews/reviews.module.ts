import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ReviewService } from "./reviews.service";
import { MovieModule } from "src/modules/movies/movies.module";
import { ReviewController } from "./reviews.controller";
import { UserModule } from "../users/users.module";

@Module({
    imports: [DbModule, MovieModule, UserModule],
    providers: [ReviewService],
    exports: [ReviewService],
    controllers: [ReviewController]
})

export class ReviewModule {}