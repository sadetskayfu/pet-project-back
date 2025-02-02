import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHtml(): string {
    return 'Hello World!';
  }
}
