import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static STORAGE_KEY = 'ai_vault_encryption_key';
  private static KEY_SIZE = 256;
  static decryptFileToUint8Array(encryptedData: string, key?: string): Uint8Array {
    const decrypted = this.decrypt(encryptedData, key); // base64 string
    const binaryString = atob(decrypted);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  static generateKey(): string {
    return CryptoJS.lib.WordArray.random(this.KEY_SIZE / 8).toString();
  }

  static deriveKeyFromPassword(password: string, salt?: string): string {
    const actualSalt = salt || CryptoJS.lib.WordArray.random(128 / 8).toString();
    return CryptoJS.PBKDF2(password, actualSalt, {
      keySize: this.KEY_SIZE / 32,
      iterations: 10000
    }).toString();
  }

  static storeKey(key: string): void {
    localStorage.setItem(this.STORAGE_KEY, key);
  }

  static getStoredKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static removeKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static encrypt(data: string, key?: string): string {
    const encryptionKey = key || this.getStoredKey();
    if (!encryptionKey) {
      throw new Error('No encryption key available');
    }

    const encrypted = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    return encrypted;
  }

  static decrypt(encryptedData: string, key?: string): string {
    const encryptionKey = key || this.getStoredKey();
    if (!encryptionKey) {
      throw new Error('No encryption key available');
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plaintext) {
        throw new Error('Failed to decrypt data');
      }

      return plaintext;
    } catch (error) {
      throw new Error('Decryption failed: ' + (error as Error).message);
    }
  }

  static encryptFile(file: File, key?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Convert to base64 using proper method
          let binaryString = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
          }
          const base64Data = btoa(binaryString);
          const encrypted = this.encrypt(base64Data, key);
          resolve(encrypted);
        } catch (error) {
          reject(error as Error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static encryptFileToUint8Array(file: File, key?: string): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);

          // Convert to base64 for encryption using proper iteration
          let binaryString = '';
          for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
          }
          const base64Data = btoa(binaryString);
          const encrypted = this.encrypt(base64Data, key);

          // Convert encrypted string to Uint8Array
          const encryptedBytes = new TextEncoder().encode(encrypted);
          resolve(encryptedBytes);
        } catch (error) {
          reject(error as Error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  }

  static decryptFile(encryptedData: string, key?: string): string {
    const decrypted = this.decrypt(encryptedData, key);
    return atob(decrypted);
  }

  static hasValidKey(): boolean {
    const key = this.getStoredKey();
    return key !== null && key.length > 0;
  }

  static exportKey(): string {
    const key = this.getStoredKey();
    if (!key) {
      throw new Error('No key to export');
    }
    return btoa(key);
  }

  static importKey(exportedKey: string): void {
    try {
      const key = atob(exportedKey);
      this.storeKey(key);
    } catch (error) {
      throw new Error('Invalid key format');
    }
  }
}
