import crypto from "crypto";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "hex"); // Use a fixed 32-byte key
const IV_LENGTH = 16; // 16 bytes for AES-CTR

function encrypt(data: Buffer) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return Buffer.concat([iv, encrypted]); // Store IV + encrypted data
}

function decrypt(encryptedData: Buffer) {
    const iv = encryptedData.slice(0, IV_LENGTH);
    const encryptedText = encryptedData.slice(IV_LENGTH);
    const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
    return Buffer.concat([decipher.update(encryptedText), decipher.final()]);
}

export { encrypt, decrypt };
