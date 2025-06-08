import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Integración TINC')
    .setDescription(`
# Introducción
Esta API proporciona endpoints para la integración con el sistema TINC. Permite gestionar servicios, tickets y assets.

# Autenticación
La API soporta dos métodos de autenticación:

## JWT (Bearer Token)
Para las interacciones desde aplicaciones web. Requiere iniciar sesión con email/password para obtener el token.

## API Key
Para integraciones programáticas. Requiere incluir la API key en el header \`X-API-Key\`.

# Filtrado de Datos
Todos los endpoints están protegidos y filtran los datos basándose en el \`Id de la cuenta\` del usuario autenticado.

# Rate Limiting
Por favor, respeta los límites de tasa para evitar interrupciones en el servicio.
    `)
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'Enter API key',
      },
      'API-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'API TINC Documentation',
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
