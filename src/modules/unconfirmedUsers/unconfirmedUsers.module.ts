import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { UnconfirmedUserService } from "./unconfirmedUsers.service";
import { ConfigModule } from "@nestjs/config";
import { CountryModule } from "src/modules/countries/countries.module";

@Module({
    imports: [DbModule, ConfigModule, CountryModule],
    providers: [UnconfirmedUserService],
    exports: [UnconfirmedUserService],
})

export class UnconfirmedUserModule {}