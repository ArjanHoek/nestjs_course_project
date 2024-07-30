import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const bootstrap = () =>
  NestFactory.create(AppModule).then((app) => app.listen(3000));

bootstrap();
