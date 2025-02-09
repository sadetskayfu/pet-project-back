import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { CountryService } from "./countries.service";
import { CountryController } from "./countries.controller";

@Module({
    imports: [DbModule],
    providers: [CountryService],
    exports: [CountryService],
    controllers: [CountryController]
})

export class CountryModule {}