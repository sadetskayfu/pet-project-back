import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ConfirmationService } from "./confirmation.service";
import { SendAuthCodeDto, SendCodeResponse } from "./dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AUTH_CONFIRM_CODE_TIME_VALID } from "src/shared/constants";

@ApiTags('Confirmation')
@Controller('confirmation')
export class ConfirmationController {
    constructor(private confirmationService: ConfirmationService){}

    @Post('/send-auth-code')
    @ApiOperation({
        description: 'Отправить код подтверждения для аутенфикации'
    })
    @ApiResponse({
        status: 200,
        type: SendCodeResponse
    })
    @HttpCode(200)
    async sendAuthCode(@Body() body: SendAuthCodeDto): Promise<SendCodeResponse> {
        const code = this.confirmationService.getCode()

        await this.confirmationService.sendAuthCode(body.userId, code, body.confirmationType)

        return this.confirmationService.createConfirmationSession(code, AUTH_CONFIRM_CODE_TIME_VALID, body.userId)
    }
}