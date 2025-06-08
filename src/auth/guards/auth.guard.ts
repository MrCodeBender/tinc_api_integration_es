import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOrApiKeyAuthGuard extends AuthGuard(['jwt', 'api-key']) {
    constructor() {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            // Intenta autenticar con cualquiera de las estrategias
            const result = await super.canActivate(context);
            return result as boolean;
        } catch (err) {
            return false;
        }
    }
} 