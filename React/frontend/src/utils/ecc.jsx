import { ec as EC } from 'elliptic';
import CryptoJS from 'crypto-js';

const ec = new EC('curve25519');

export default async function FileEncrypt(file) {
  try {
    // Read the file as an ArrayBuffer
    const fileArrayBuffer = await file.arrayBuffer();

    // Generate ECC key pair
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic();
    const privateKey = keyPair.getPrivate();

    // Generate a random AES key
    const aesKey = CryptoJS.lib.WordArray.random(32);
    console.log("AES Key:", aesKey.toString());

    // Convert ArrayBuffer to WordArray for CryptoJS
    const wordArray = CryptoJS.lib.WordArray.create(fileArrayBuffer);

    // Encrypt the file using AES
    const encryptedData = CryptoJS.AES.encrypt(wordArray, aesKey.toString());

    // Use the public key to derive a shared secret
    const sharedSecret = keyPair.derive(publicKey);
    
    // Use the shared secret to encrypt the AES key
    const encryptedAesKey = CryptoJS.AES.encrypt(aesKey.toString(), sharedSecret.toString(16)).toString();

    // Convert the encrypted data to a Base64 string
    const encryptedBase64 = encryptedData.toString();

    return {
      file: encryptedBase64,
      AesKey: encryptedAesKey,
      privateKey: privateKey.toString(16),
      publicKey: publicKey.encode('hex'),
      originalType: file.type
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}