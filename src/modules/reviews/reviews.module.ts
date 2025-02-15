import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ReviewService } from "./reviews.service";
import { MovieModule } from "src/modules/movies/movies.module";
import { ReviewController } from "./reviews.controller";
import { ReviewLikeModule } from "src/modules/reviewLikes/reviewLikes.module";

@Module({
    imports: [DbModule, MovieModule, ReviewLikeModule],
    providers: [ReviewService],
    exports: [ReviewService],
    controllers: [ReviewController]
})

export class ReviewModule {}