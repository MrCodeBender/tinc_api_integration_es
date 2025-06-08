const crypto = require('crypto');

// Configura estas variables con tus valores
const API_KEY = '89c4e14e-5e17-4235-b7cd-e62ba5933083';
const API_SECRET = '0d727780-687c-48e8-a21b-05c85664119f';
const timestamp = Date.now().toString();

// El cuerpo de la solicitud
const body = JSON.stringify({
  ticket_id: 123,
  account_id: 456,
  data: {
    status: "open",
    priority: "high"
  }
});

// Generar IV
const iv = crypto.createHash('sha256')
  .update(API_SECRET)
  .digest()
  .slice(0, 16);

// Asegurar que la clave tenga 32 bytes (256 bits)
const key = crypto.createHash('sha256')
  .update(API_SECRET)
  .digest();

// Encriptar el cuerpo
const cipher = crypto.createCipheriv(
  'aes-256-cbc',
  key,
  iv
);

const encryptedBody = cipher.update(body, 'utf8', 'base64') + 
  cipher.final('base64');

// Crear el JSON final con el mensaje encriptado
const finalBody = JSON.stringify({
  message: encryptedBody
});

// Generar firma usando el JSON final exactamente como se enviará
const hmac = crypto.createHmac('sha256', API_SECRET);
hmac.update(timestamp);
hmac.update(finalBody);
const signature = hmac.digest('hex');

// Verificar la firma generada
const verifyHmac = crypto.createHmac('sha256', API_SECRET);
verifyHmac.update(timestamp);
verifyHmac.update(finalBody);
const verifySignature = verifyHmac.digest('hex');

console.log('=== Valores para la petición ===');
console.log('\nHeaders:');
console.log(`X-API-Key: ${API_KEY}`);
console.log(`X-Timestamp: ${timestamp}`);
console.log(`X-Signature: ${signature}`);
console.log('\nBody encriptado:');
console.log(finalBody);
console.log('\nVerificación de firma:');
console.log('Firma generada:', signature);
console.log('Firma verificada:', verifySignature);
console.log('Coinciden:', signature === verifySignature);
console.log('\n=== Instrucciones para Insomnia ===');
console.log('1. Método: POST');
console.log('2. URL: http://localhost:3000/api/v1/tickets');
console.log('3. Headers:');
console.log('   - X-API-Key: (el valor mostrado arriba)');
console.log('   - X-Timestamp: (el valor mostrado arriba)');
console.log('   - X-Signature: (el valor mostrado arriba)');
console.log('   - Content-Type: application/json');
console.log('4. Body: (el valor encriptado mostrado arriba)'); 