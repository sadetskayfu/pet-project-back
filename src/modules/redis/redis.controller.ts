import { Controller, Get, Query } from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
    constructor(private readonly redisService: RedisService) {}

    @Get('set')
    async set(@Query('key') key: string, @Query('value') value: string) {
        await this.redisService.set(key, value);
        return 'OK';
    }

    @Get('get')
    async get(@Query('key') key: string) {
        return this.redisService.get(key);
    }

    @Get('del')
    async del(@Query('key') key: string) {
        await this.redisService.del(key);
        return 'OK';
    }
}