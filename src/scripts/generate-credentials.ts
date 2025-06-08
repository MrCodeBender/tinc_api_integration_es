import { CredentialsGenerator } from '../utils/credentials-generator';

async function main() {
    if (process.env.NODE_ENV === 'production') {
        console.error('❌ Esta herramienta está desactivada en producción.');
        process.exit(1);
    }

    console.log('🔹 Generando credenciales...');

    const { password, hashed } = await CredentialsGenerator.generatePassword();
    const apiKey = CredentialsGenerator.generateApiKey();

    console.log('✅ Credenciales generadas con éxito:');
    console.log(`🔑 Contraseña: ${password}`);
    console.log(`🔒 Hash: ${hashed}`);
    console.log(`🗝️ API Key: ${apiKey}`);
}

main();
