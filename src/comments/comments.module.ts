import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { MovieModule } from "src/movies/movies.module";
import { CommentLikeModule } from "src/commentLikes/commentLikes.module";
import { CommentService } from "./comments.service";
import { ReviewModule } from "src/reviews/reviews.module";
import { CommentController } from "./comments.controller";

@Module({
    imports: [DbModule, MovieModule, CommentLikeModule, ReviewModule],
    providers: [CommentService],
    exports: [CommentService],
    controllers: [CommentController]
})

export class CommentModule {}