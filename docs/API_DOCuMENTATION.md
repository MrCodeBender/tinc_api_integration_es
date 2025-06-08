# API Documentation

## Autenticación

La API soporta dos métodos de autenticación:

### 1. JWT (Email/Password)

Este método es utilizado principalmente para usuarios que acceden a través de la interfaz web.

1. **Login**
   ```bash
   POST /auth/login
   Content-Type: application/json

   {
     "email": "usuario@ejemplo.com",
     "password": "contraseña"
   }
   ```

   **Respuesta:**
   ```json
   {
     "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "email": "usuario@ejemplo.com",
       "is_account_main_id": "123"
     }
   }
   ```

2. **Uso del Token**
   ```bash
   GET /services
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 2. API Key

Este método es utilizado principalmente para integraciones programáticas y servicios automatizados.

```bash
GET /services
X-API-Key: tu-api-key
```

## Seguridad y Filtrado

- Cada usuario tiene un `is_account_main_id` asociado
- Todas las consultas son filtradas automáticamente por `is_account_main_id`
- Los usuarios solo pueden acceder a los recursos asociados a su `is_account_main_id`

## Endpoints Principales

### Servicios

#### Listar Servicios
```bash
GET /services
```
- Requiere autenticación (JWT o API Key)
- Retorna solo los servicios asociados al `is_account_main_id` del usuario

#### Obtener un Servicio Específico
```bash
GET /services/:id
```
- Requiere autenticación (JWT o API Key)
- Verifica que el servicio pertenezca al `is_account_main_id` del usuario

#### Crear un Servicio
```bash
POST /services
Content-Type: application/json

{
  "name": "Nombre del Servicio",
  "description": "Descripción del servicio"
}
```
- Requiere autenticación (JWT o API Key)
- Asocia automáticamente el `is_account_main_id` del usuario

### Tickets

#### Listar Tickets
```bash
GET /tickets
```
- Requiere autenticación (JWT o API Key)
- Retorna solo los tickets asociados al `is_account_main_id` del usuario

#### Obtener un Ticket Específico
```bash
GET /tickets/:id
```
- Requiere autenticación (JWT o API Key)
- Verifica que el ticket pertenezca al `is_account_main_id` del usuario

#### Crear un Ticket
```bash
POST /tickets
Content-Type: application/json

{
  "title": "Título del Ticket",
  "description": "Descripción del ticket",
  "service_id": 1
}
```
- Requiere autenticación (JWT o API Key)
- Asocia automáticamente el `is_account_main_id` del usuario

## Manejo de Errores

### Errores de Autenticación
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### API Key Inválida
```json
{
  "statusCode": 401,
  "message": "Invalid API key"
}
```

### Recurso No Encontrado
```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

### Acceso No Autorizado
```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

## Buenas Prácticas

1. **Almacenamiento Seguro**
   - Nunca almacenar API keys en código fuente
   - Usar variables de entorno para configuraciones sensibles

2. **Manejo de Tokens**
   - Almacenar tokens JWT de forma segura
   - Renovar tokens antes de su expiración
   - No enviar tokens en URLs

3. **Rate Limiting**
   - Respetar los límites de tasa de la API
   - Implementar retroceso exponencial en caso de errores

4. **Manejo de Errores**
   - Siempre manejar los errores de forma apropiada
   - Implementar reintentos para errores temporales
   - Registrar errores para diagnóstico

## Ejemplos de Uso

### Ejemplo con cURL (JWT)
```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"contraseña"}'

# Usar el token
curl http://localhost:3000/services \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Ejemplo con cURL (API Key)
```bash
curl http://localhost:3000/services \
  -H "X-API-Key: tu-api-key"
```

### Ejemplo con JavaScript (Fetch)
```javascript
// JWT
const response = await fetch('http://localhost:3000/services', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
});

// API Key
const response = await fetch('http://localhost:3000/services', {
  headers: {
    'X-API-Key': 'tu-api-key'
  }
});
```