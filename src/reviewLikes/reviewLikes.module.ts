import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ReviewLikeService } from "./reviewLikes.service";

@Module({
    imports: [DbModule],
    providers: [ReviewLikeService],
    exports: [ReviewLikeService],
})

export class ReviewLikeModule {}