import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ProfileService } from "./profile.service";

@Module({
    imports: [DbModule],
    providers: [ProfileService],
    exports: [ProfileService]
})

export class ProfileModule {}