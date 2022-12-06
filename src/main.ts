import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['debug'] });
  app.enableCors();
  await app.listen(process.env.PORT || 5001);
}
bootstrap();
