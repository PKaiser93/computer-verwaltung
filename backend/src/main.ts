import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Unbekannte Felder entfernen
      forbidNonWhitelisted: true, // und dafür Fehler werfen
      transform: true, // Payloads in DTO-Klassen casten
    }),
  );

  app.enableCors({
    origin: true, // oder explizit: ['http://localhost:3000']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  console.log('Backend läuft auf http://localhost:3000');
}
bootstrap();
