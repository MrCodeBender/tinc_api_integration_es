# Guía de Tablas para Integración API

Este documento describe las tablas principales necesarias para integrar con el sistema a través de la API. Estas tablas contienen la información esencial para la autenticación y el manejo de datos en el sistema.

## Tablas de Autenticación

### is_account_integration_auth
Esta tabla es fundamental para la autenticación mediante API Key. Contiene las credenciales necesarias para acceder al sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | bigint | Identificador único del registro |
| api_key | varchar | Clave API única para autenticación |
| web_hook | varchar | URL del webhook para notificaciones |
| is_account_main_id | bigint | ID de la cuenta principal asociada |
| is_active | boolean | Estado de la API Key (activa/inactiva) |

**Nota**: Para obtener acceso a la API, necesitas solicitar una API Key válida. Esta clave debe incluirse en el header `X-API-Key` de todas las peticiones.

## Tablas de Plantillas de Rutinas

### is_account_pdf_templates
Esta tabla es fundamental para la configuración de plantillas de rutinas. Permite asociar plantillas PDF específicas a cada cuenta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | bigint | Identificador único del registro |
| is_account_main_id | bigint | ID de la cuenta a la que se asocia la plantilla |
| pdf_template_name | varchar | Nombre descriptivo de la plantilla |
| pdf_template_id | bigint | ID de la plantilla PDF en el sistema |
| pdf_template_type | int | Tipo de plantilla (3 = Plantilla de Rutinas) |
| is_active | boolean | Estado de la asociación (activa/inactiva) |
| create_at | timestamp | Fecha de creación del registro |
| update_at | timestamp | Fecha de última actualización |

**Nota Importante para Plantillas de Rutinas**:
1. Para habilitar el uso de plantillas de rutinas en una cuenta, es necesario crear un registro en esta tabla con:
   - `pdf_template_type = 3` (indica que es una plantilla de rutinas)
   - `is_active = 1` (para activar la asociación)
   - Un `pdf_template_id` válido que corresponda a una plantilla existente
2. Esta configuración debe realizarse manualmente en la base de datos
3. El campo `pdf_template_name` debe ser descriptivo para facilitar la identificación

### is_account_routine_templates
Esta tabla asocia las rutinas con sus plantillas PDF correspondientes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | bigint | Identificador único del registro |
| is_routine_main_id | bigint | ID de la rutina asociada |
| is_account_pdf_templates_id | bigint | ID de la plantilla PDF asociada |
| create_at | timestamp | Fecha de creación del registro |
| update_at | timestamp | Fecha de última actualización |
| is_active | tinyint(1) | Estado de la asociación (activa/inactiva) |

**Notas Importantes**:
1. La relación se establece a través del `is_account_pdf_templates_id` que referencia a `is_account_pdf_templates.id`
2. El campo `is_active` determina si la asociación está vigente

**Ejemplo de Configuración de Plantilla de Rutinas**:

```sql
-- Ejemplo de inserción de una plantilla de rutinas para una cuenta
INSERT INTO is_account_pdf_templates (
    is_account_main_id,
    pdf_template_name,
    pdf_template_id,
    pdf_template_type,
    is_active,
    create_at,
    update_at
) VALUES (
    123,                           -- ID de la cuenta
    'Plantilla de Rutinas 2024',   -- Nombre descriptivo
    456,                           -- ID de la plantilla PDF
    3,                             -- Tipo 3 = Plantilla de Rutinas
    1,                             -- Activa
    CURRENT_TIMESTAMP,             -- Fecha de creación
    CURRENT_TIMESTAMP              -- Fecha de actualización
);
```

```sql
-- Ejemplo de inserción de una plantilla de rutinas para una cuenta
INSERT INTO is_account_routine_templates (
    is_routine_main_id,
    is_account_pdf_templates_id
) VALUES (
    123,                           -- ID de la rutina
    456,                           -- ID de la plantilla PDF
);
```


## Relaciones Importantes

1. **Autenticación**:
   - `is_account_integration_auth.is_account_main_id` → Relaciona la API Key con una cuenta específica

2. **Plantillas de Rutinas**:
   - `is_account_pdf_templates.is_account_main_id` → Relaciona la plantilla con una cuenta
   - `is_account_pdf_templates.pdf_template_id` → Referencia a la plantilla PDF específica

## Notas Importantes

1. **Autenticación**:
   - Todas las peticiones a la API deben incluir una API Key válida en el header `X-API-Key`
   - La API Key debe estar activa (`is_active = true`)
   - La API Key está asociada a una cuenta específica

2. **Plantillas de Rutinas**:
   - La configuración de plantillas debe realizarse manualmente en la base de datos
   - Es crucial usar el tipo correcto (3) para plantillas de rutinas
   - Mantener un registro de las plantillas activas por cuenta
   - Verificar que el `pdf_template_id` corresponda a una plantilla válida

3. **Seguridad**:
   - Las API Keys son únicas y no deben compartirse
   - Cada API Key tiene acceso solo a los datos de su cuenta asociada
   - Se recomienda rotar las API Keys periódicamente











