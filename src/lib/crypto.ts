import sodium from 'libsodium-wrappers-sumo';

// Initialize sodium
let sodiumReady = false;

export const initSodium = async () => {
  if (!sodiumReady) {
    await sodium.ready;
    sodiumReady = true;
  }
};

export interface VaultKdfParams {
  opslimit: number;
  memlimit: number;
  parallelism: number;
  version: number;
}

export const getDefaultKdfParams = async (): Promise<VaultKdfParams> => {
  await initSodium();
  
  return {
    opslimit: sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    memlimit: sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    parallelism: 1,
    version: sodium.crypto_pwhash_ALG_ARGON2ID13,
  };
};

export const generateVaultKey = async (): Promise<Uint8Array> => {
  await initSodium();
  return sodium.randombytes_buf(32);
};

export const generateSalt = async (): Promise<Uint8Array> => {
  await initSodium();
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
};

export const deriveKEK = async (
  password: string, 
  salt: Uint8Array, 
  params: VaultKdfParams
): Promise<Uint8Array> => {
  await initSodium();
  
  return sodium.crypto_pwhash(
    32, // key length
    password,
    salt,
    params.opslimit,
    params.memlimit,
    params.version
  );
};

// Robust base64 decoder (handles padding and URL-safe variants)
export const decodeBase64 = async (input: string): Promise<Uint8Array> => {
  await initSodium();
  try {
    // Try standard first
    return sodium.from_base64(input, sodium.base64_variants.ORIGINAL);
  } catch {
    // Normalize URL-safe and add padding
    let s = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = (4 - (s.length % 4)) % 4;
    if (pad) s += '='.repeat(pad);
    try {
      return sodium.from_base64(s, sodium.base64_variants.ORIGINAL);
    } catch {
      // Final fallback via atob
      const bin = atob(s);
      const out = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
      return out;
    }
  }
};

export const wrapVaultKey = async (vaultKey: Uint8Array, kek: Uint8Array): Promise<{ nonce: Uint8Array; ciphertext: Uint8Array }> => {
  await initSodium();
  
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(vaultKey, nonce, kek);
  
  return { nonce, ciphertext };
};

export const unwrapVaultKey = async (wrappedKey: string, kek: Uint8Array): Promise<Uint8Array> => {
  await initSodium();
  
  try {
    // Decode combined (nonce || ciphertext)
    const wrapped = await decodeBase64(wrappedKey);
    if (wrapped.length !== 72) {
      throw new Error(`Invalid wrapped key length: expected 72 bytes, got ${wrapped.length} bytes`);
    }
    const nonce = wrapped.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = wrapped.slice(sodium.crypto_secretbox_NONCEBYTES);
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, kek);
  } catch (error: any) {
    if (error.message?.includes('verification failed')) {
      throw new Error('Invalid master password');
    }
    if (error.message?.includes('Invalid wrapped key length')) {
      throw new Error(error.message);
    }
    throw new Error('Invalid base64 format in wrapped vault key');
  }
};

export const encryptField = async (plaintext: string, vaultKey: Uint8Array): Promise<{ nonce: string; ciphertext: string }> => {
  await initSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, vaultKey);
  
  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext),
  };
};

export const decryptField = async (nonce: string, ciphertext: string, vaultKey: Uint8Array): Promise<string> => {
  await initSodium();
  const nonceBytes = sodium.from_base64(nonce);
  const ciphertextBytes = sodium.from_base64(ciphertext);
  
  const plaintext = sodium.crypto_secretbox_open_easy(ciphertextBytes, nonceBytes, vaultKey);
  return sodium.to_string(plaintext);
};

export const combineNonceAndCiphertext = async (nonce: Uint8Array, ciphertext: Uint8Array): Promise<string> => {
  await initSodium();
  
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);
  return sodium.to_base64(combined);
};
