import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from "./users.service";

@Injectable()
export class TasksService {
    constructor(private userService: UserService){}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async deleteExpiredUnconfirmedUsers() {
        //this.userService.deleteExpiredUnconfirmedUsers()
    }
}