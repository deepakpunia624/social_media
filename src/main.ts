import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/logger';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Cors enable
   app.enableCors();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(bodyParser.raw());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Social_media')
    .setDescription('The Social_media API description')
    .setVersion('1.0')
    .addTag('Social_media')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useLogger(logger);
  await app.listen(3000);
}
bootstrap();
