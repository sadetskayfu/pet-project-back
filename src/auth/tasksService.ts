import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { UnconfirmedUserService } from "src/unconfirmedUsers/unconfirmedUsers.service";

@Injectable()
export class TasksService {
    constructor(private unconfirmedUserService: UnconfirmedUserService){}

    @Cron(CronExpression.EVERY_MINUTE)
    async deleteExpiredUnconfirmedUsers() {
        this.unconfirmedUserService.deleteExpiredUsers()
    }
}