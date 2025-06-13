import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EsAccountIntegrationAuth } from '../entities/EsAccountIntegrationAuth';
import { AuthView } from '../entities/AuthView';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(AuthView)
        private authViewRepo: Repository<AuthView>,
        @InjectRepository(EsAccountIntegrationAuth)
        private apiKeyRepo: Repository<EsAccountIntegrationAuth>,
        private readonly configService: ConfigService,
    ) { }

    async validateUser(email: string, pass: string): Promise<AuthView> {
        const user = await this.authViewRepo.findOne({ where: { email } });
        if (!user || !user.password) {
          console.error(`Authentication attempt failed: User not found or password missing for email: ${email}`);
          throw new UnauthorizedException('Credenciales inválidas');
        }

        const legacySalt = this.configService.get<string>('LEGACY_PASSWORD_SALT');
        if (!legacySalt) {
          console.error('CRITICAL: LEGACY_PASSWORD_SALT environment variable is not set!');
          throw new UnauthorizedException('Error de configuración de autenticación.');
        }

        const stringToHash = pass + legacySalt;

        const computedHash = crypto
          .createHash('sha256')
          .update(stringToHash)
          .digest('hex');

        const isMatch = computedHash.toLowerCase() === user.password.toLowerCase();

        if (!isMatch) {
            console.warn(`Authentication failed for user: ${email}. Computed hash: ${computedHash}, Stored hash: ${user.password}`);
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result as AuthView;
    }

    async login(user: AuthView) {
        const responseData = {
          id: user.id?.toString() ?? null,
          email: user.email ?? null,
          full_name: user.full_name ?? null,
          terms_accepted: user.terms_accepted ? '1' : '0',
          es_account_user_id: user.es_account_user_id?.toString() ?? null,
          is_customer_main_id: user.is_customer_main_id?.toString() ?? null,
          es_account_main_id: user.es_account_main_id?.toString() ?? null,
          es_account_main_name: user.es_account_main_name ?? null,
          gc_currency_cat_name: user.gc_currency_cat_name ?? null,
          gc_city_cat_id: user.gc_city_cat_id?.toString() ?? null,
          gc_state_cat_id: user.gc_state_cat_id?.toString() ?? null,
          gc_country_cat_id: user.gc_country_cat_id?.toString() ?? null,
          es_account_sector_cat_id: user.es_account_sector_cat_id?.toString() ?? null,
          es_account_type_cat_id: user.es_account_type_cat_id?.toString() ?? null,
          first_log: user.first_log ? '1' : '0',
          es_user_role_cat_id: user.es_user_role_cat_id?.toString() ?? null,
          es_user_role_cat_name: user.es_user_role_cat_name ?? null,
          is_plan_paid: user.is_plan_paid ? '1' : '0',
          is_active: user.is_active ? '1' : '0',
          es_user_timezone_cat_id: user.es_user_timezone_cat_id?.toString() ?? null,
          es_user_timezone_cat_name: user.es_user_timezone_cat_name ?? null,
          create_at: user.create_at?.toISOString().slice(0, 19).replace('T', ' ') ?? null,
          es_account_main_create_at: user.es_account_main_create_at?.toISOString().slice(0, 19).replace('T', ' ') ?? null,
          es_supplier_main_id: user.es_supplier_main_id?.toString() ?? null,
          es_account_plan_cat_id: user.es_account_plan_cat_id?.toString() ?? null,
        };
    
        const payload = { 
            id: user.id,
            email: user.email,
            es_account_main_id: user.es_account_main_id 
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
        });

        return {
            status: 200,
            message: "Login successful",
            data: responseData,
            token: accessToken,
        };
    }

    async validateApiKey(apiKey: string): Promise<any> {
        const user = await this.apiKeyRepo.findOne({ where: { api_key: apiKey } });
        if (!user) {
            console.warn(`Invalid API Key used: ${apiKey}`);
            throw new UnauthorizedException('API Key inválida');
        }

        return {
            id: user.id,
            is_account_main_id: user.es_account_main_id
        };
    }
}
