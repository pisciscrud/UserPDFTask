import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middleware/exception-handler.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const host = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(host));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
