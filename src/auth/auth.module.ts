import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { EsAccountIntegrationAuth } from 'src/entities/EsAccountIntegrationAuth';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ApiKeyStrategy } from './strategies/api-key.strategy';
import { AuthView } from 'src/entities/AuthView';

@Module({
    imports: [
        TypeOrmModule.forFeature([EsAccountIntegrationAuth, AuthView]),
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, ApiKeyStrategy],
    exports: [AuthService, JwtModule],
})
export class AuthModule { }
