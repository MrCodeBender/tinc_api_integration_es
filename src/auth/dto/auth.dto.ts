import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'test@gmail.com',
        description: 'Email del usuario',
    })
    email: string;

    @ApiProperty({
        example: 'c7fd9fabab1ff1a2',
        description: 'Contraseña del usuario',
    })
    password: string;
}

class UserDataDto {
    @ApiProperty({ example: '299' })
    id: string;

    @ApiProperty({ example: 'pruebastinc+ESCMMS@gmail.com' })
    email: string;

    @ApiProperty({ example: 'Isela Toledo' })
    full_name: string;

    @ApiProperty({ example: '1' })
    terms_accepted: string;

    @ApiProperty({ example: '99' })
    es_account_user_id: string;

    @ApiProperty({ example: null })
    is_customer_main_id: string | null;

    @ApiProperty({ example: '49' })
    es_account_main_id: string;

    @ApiProperty({ example: 'Empresa gOret; lOret; µ om; " & CMMS Comercialización e ingeniería en Equipo Médico S.A de C.V' })
    es_account_main_name: string;

    @ApiProperty({ example: 'COP' })
    gc_currency_cat_name: string;

    @ApiProperty({ example: '2870' })
    gc_city_cat_id: string;

    @ApiProperty({ example: '54' })
    gc_state_cat_id: string;

    @ApiProperty({ example: '5' })
    gc_country_cat_id: string;

    @ApiProperty({ example: '3' })
    es_account_sector_cat_id: string;

    @ApiProperty({ example: '1' })
    es_account_type_cat_id: string;

    @ApiProperty({ example: '1' })
    first_log: string;

    @ApiProperty({ example: '6' })
    es_user_role_cat_id: string;

    @ApiProperty({ example: 'Super Administrador' })
    es_user_role_cat_name: string;

    @ApiProperty({ example: '1' })
    is_plan_paid: string;

    @ApiProperty({ example: '1' })
    is_active: string;

    @ApiProperty({ example: '223' })
    es_user_timezone_cat_id: string;

    @ApiProperty({ example: 'CST' })
    es_user_timezone_cat_name: string;

    @ApiProperty({ example: '2021-03-26 18:58:18' })
    create_at: string;

    @ApiProperty({ example: '2021-03-26 18:59:07' })
    es_account_main_create_at: string;

    @ApiProperty({ example: '28' })
    es_supplier_main_id: string;

    @ApiProperty({ example: '4' })
    es_account_plan_cat_id: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: 200 })
    status: number;

    @ApiProperty({ example: 'Login successful' })
    message: string;

    @ApiProperty({ type: UserDataDto })
    data: UserDataDto;

    @ApiProperty({
        example: 'eyJ0eXAiOiJKV1QiLC...',
        description: 'Token JWT para autenticación',
    })
    token: string;
}

export class AuthErrorDto {
    @ApiProperty({ example: 401 })
    statusCode: number;

    @ApiProperty({ example: 'Credenciales inválidas' })
    message: string;

    @ApiProperty({ example: 'Unauthorized' })
    error: string;
} 