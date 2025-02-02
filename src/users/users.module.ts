import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { DbModule } from "src/db/db.module";

@Module({
    imports: [DbModule],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}