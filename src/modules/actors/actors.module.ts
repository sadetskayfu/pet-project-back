import { Module } from "@nestjs/common";
import { DbModule } from "src/db/db.module";
import { ActorService } from "./actors.service";
import { ActorController } from "./actors.controller";

@Module({
    imports: [DbModule],
    providers: [ActorService],
    exports: [ActorService],
    controllers: [ActorController]
})

export class ActorModule {}