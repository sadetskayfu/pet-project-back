import { forwardRef, Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { UserModule } from "src/modules/users/users.module";
import { RoleService } from "./roles.service";
import { RoleController } from "./roles.controller";

@Module({
    imports: [DbModule, forwardRef(() => UserModule)],
    providers: [RoleService],
    exports: [RoleService],
    controllers: [RoleController]
})

export class RoleModule {}