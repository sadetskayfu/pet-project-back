import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { UserModule } from "src/users/users.module";
import { RoleService } from "./roles.service";
import { RoleController } from "./roles.controller";

@Module({
    imports: [DbModule, UserModule],
    providers: [RoleService],
    exports: [RoleService],
    controllers: [RoleController]
})

export class RoleModule {}