import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { DbModule } from "src/db/db.module";
import { CountryModule } from "src/countries/countries.module";
import { RoleModule } from "src/roles/roles.module";

@Module({
    imports: [DbModule, CountryModule, forwardRef(() => RoleModule)],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}