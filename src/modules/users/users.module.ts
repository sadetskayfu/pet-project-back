import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { DbModule } from "src/db/db.module";
import { RoleModule } from "src/modules/roles/roles.module";
import { TasksService } from "./tasks.service";
import { ConfirmationModule } from "../confirmation/confirmation.module";
import { UserController } from "./users.controller";

@Module({
    imports: [DbModule, forwardRef(() => RoleModule), forwardRef(() => ConfirmationModule)],
    providers: [UserService, TasksService],
    controllers: [UserController],
    exports: [UserService]
})

export class UserModule {}