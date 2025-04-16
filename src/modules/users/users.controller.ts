import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionInfo } from 'src/modules/auth/session-info.decorator';
import { SessionInfoDto } from 'src/modules/auth/dto';
import { AuthGuard } from 'src/modules/auth/auth.guard';
import { UserService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('avatar')
    @ApiOperation({
        summary: 'Получить аватар пользователя',
    })
    @ApiResponse({
        status: 200,
    })
    @UseGuards(AuthGuard)
    async getUserAvatar(
        @SessionInfo() session?: SessionInfoDto,
    ): Promise<string | null> {
        return this.userService.getUserAvatar(session?.id)
    }
}
