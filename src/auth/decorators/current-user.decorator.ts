import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
    id: number;
    es_account_main_id: number;
    email?: string; // Solo disponible en JWT
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        
        // Validar que tenemos al menos las propiedades básicas
        if (!user || !user.id || !user.es_account_main_id) {
            throw new Error('Invalid user data from authentication');
        }
        
        return {
            id: user.id,
            es_account_main_id: user.es_account_main_id,
            email: user.email // Puede ser undefined para API Key
        };
    },
); 