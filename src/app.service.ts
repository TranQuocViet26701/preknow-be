import { Injectable } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class AppService {
  healthCheck(): string {
    return `NestJS server is running on PORT:::${process.env.PORT} 🚀`;
  }
}
