import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { MovieModule } from "src/modules/movies/movies.module";
import { CommentLikeModule } from "src/modules/commentLikes/commentLikes.module";
import { CommentService } from "./comments.service";
import { ReviewModule } from "src/modules/reviews/reviews.module";
import { CommentController } from "./comments.controller";

@Module({
    imports: [DbModule, MovieModule, CommentLikeModule, ReviewModule],
    providers: [CommentService],
    exports: [CommentService],
    controllers: [CommentController]
})

export class CommentModule {}