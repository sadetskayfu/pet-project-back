import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { CommentLikeService } from "./commentLikes.service";

@Module({
    imports: [DbModule],
    providers: [CommentLikeService],
    exports: [CommentLikeService],
})

export class CommentLikeModule {}