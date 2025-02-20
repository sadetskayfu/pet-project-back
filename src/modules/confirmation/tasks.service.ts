import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfirmationService } from "./confirmation.service";

@Injectable()
export class TasksService {
    constructor(private confirmationService: ConfirmationService){}

    @Cron(CronExpression.EVERY_MINUTE)
    async deleteExpiredConfirmationSession() {
        this.confirmationService.deleteExpiredConfirmationSession()
    }
}