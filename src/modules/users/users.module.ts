import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { DbModule } from "src/db/db.module";
import { RoleModule } from "src/modules/roles/roles.module";
import { ProfileModule } from "src/modules/profile/profile.module";

@Module({
    imports: [DbModule, ProfileModule, forwardRef(() => RoleModule)],
    providers: [UserService],
    exports: [UserService]
})

export class UserModule {}