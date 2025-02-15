// import { Module, Global } from '@nestjs/common';
// import { RedisService } from './redis.service';
// import { RedisController } from './redis.controller';
// import Redis from 'ioredis';

// @Global()
// @Module({
//     providers: [
//         {
//             provide: 'REDIS_CLIENT',
//             useFactory: () => {
//                 return new Redis({
//                     host: 'localhost',
//                     port: 6379,
//                     password: process.env.REDIS_PASSWORD
//                 });
//             },
//         },
//         RedisService,
//     ],
//     exports: ['REDIS_CLIENT', RedisService], // Экспортируем клиент Redis и сервис
// })
// export class RedisModule {}