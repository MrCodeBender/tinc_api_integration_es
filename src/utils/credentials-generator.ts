import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export class CredentialsGenerator {
    static async generatePassword(): Promise<{ password: string; hashed: string }> {
        const password = crypto.randomBytes(8).toString('hex'); // Generate random password
        const saltRounds = 10;
        const hashed = await bcrypt.hash(password, saltRounds); // Hash the password

        return { password, hashed };
    }

    static generateApiKey(): string {
        return crypto.randomBytes(32).toString('hex'); // Generate random API Key of 64 characters
    }

    static async HashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
