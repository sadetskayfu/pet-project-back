import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { UnconfirmedUserService } from "./unconfirmedUsers.service";

@Module({
    imports: [DbModule],
    providers: [UnconfirmedUserService],
    exports: [UnconfirmedUserService],
})

export class UnconfirmedUserModule {}