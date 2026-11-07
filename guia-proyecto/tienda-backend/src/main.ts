import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Configure CORS
  app.enableCors({
    origin: 'https://refactored-invention-969jwvvjx572p4jq-3000.app.github.dev', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    // https://refactored-invention-969jwvvjx572p4jq-3000.app.github.dev
    // https://ominous-succotash-pjr6v6w6q99vhrvwj-3000.app.github.dev
  });

  const config = new DocumentBuilder() // coumentacion de swagger
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
