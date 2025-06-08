import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiKeyAuthGuard } from './guards/api-key-auth.guard';
import { LoginDto, LoginResponseDto, AuthErrorDto } from './dto/auth.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ 
        summary: 'Iniciar sesión', 
        description: 'Inicia sesión con email y contraseña para obtener un token JWT'
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Login exitoso', 
        type: LoginResponseDto 
    })
    @ApiResponse({ 
        status: 401, 
        description: 'Credenciales inválidas', 
        type: AuthErrorDto 
    })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }

    @Post('protected')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ 
        summary: 'Ruta protegida JWT', 
        description: 'Ejemplo de ruta protegida que requiere autenticación JWT' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Acceso exitoso',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Ruta protegida con JWT'
                },
                user: {
                    type: 'object',
                    properties: {
                        userId: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'usuario@ejemplo.com' },
                        is_account_main_id: { type: 'string', example: '123' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'No autorizado', 
        type: AuthErrorDto 
    })
    getProtectedResource(@Request() req) {
        return { message: 'Ruta protegida con JWT', user: req.user };
    }

    @Post('protected-api')
    @UseGuards(ApiKeyAuthGuard)
    @ApiHeader({
        name: 'X-API-Key',
        description: 'API Key para autenticación',
        required: true,
        schema: {
            type: 'string',
            example: 'tu-api-key-aquí'
        }
    })
    @ApiOperation({ 
        summary: 'Ruta protegida API Key', 
        description: 'Ejemplo de ruta protegida que requiere autenticación por API Key' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Acceso exitoso',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Ruta protegida con API Key'
                },
                user: {
                    type: 'object',
                    properties: {
                        id: { type: 'number', example: 1 },
                        email: { type: 'string', example: 'usuario@ejemplo.com' },
                        is_account_main_id: { type: 'string', example: '123' }
                    }
                }
            }
        }
    })
    @ApiResponse({ 
        status: 401, 
        description: 'API Key inválida', 
        type: AuthErrorDto 
    })
    getProtectedApiResource(@Request() req) {
        return { message: 'Ruta protegida con API Key', user: req.user };
    }
}
