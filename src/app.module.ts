import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EsAccountIntegrationAuth } from './entities/EsAccountIntegrationAuth';
import * as Joi from 'joi';
import { AssetsModule } from './modules/assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
      }),
      isGlobal: true, // make env variables available globally 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // Automatic load of entities
      synchronize: false, // ⚠️ Warning: keep disabled this option in production
      logging: true, // Optional, useful for debugging
    }),
    TypeOrmModule.forFeature([EsAccountIntegrationAuth]),
    AuthModule,
    AssetsModule,
  ],
})
export class AppModule { }
