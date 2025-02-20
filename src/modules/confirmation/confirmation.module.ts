import { Module, forwardRef } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ConfirmationService } from "./confirmation.service";
import { ConfirmationController } from "./confirmation.controller";
import { MailService } from "./mail.service";
import { TasksService } from "./tasks.service";
import { UserModule } from "../users/users.module";

@Module({
    imports: [DbModule, forwardRef(() => UserModule)],
    providers: [ConfirmationService, MailService, TasksService],
    exports: [ConfirmationService],
    controllers: [ConfirmationController]
})

export class ConfirmationModule {}