import sodium from 'libsodium-wrappers';

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

export const DEFAULT_KDF_PARAMS: VaultKdfParams = {
  opslimit: 3,
  memlimit: 64 * 1024 * 1024, // 64MB
  parallelism: 1,
  version: sodium.crypto_pwhash_ALG_ARGON2ID,
};

export const generateVaultKey = (): Uint8Array => {
  return sodium.randombytes_buf(32);
};

export const generateSalt = (): Uint8Array => {
  return sodium.randombytes_buf(16);
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

export const wrapVaultKey = (vaultKey: Uint8Array, kek: Uint8Array): { nonce: Uint8Array; ciphertext: Uint8Array } => {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(vaultKey, nonce, kek);
  
  return { nonce, ciphertext };
};

export const unwrapVaultKey = (wrappedKey: string, kek: Uint8Array): Uint8Array => {
  const wrapped = sodium.from_base64(wrappedKey);
  const nonce = wrapped.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = wrapped.slice(sodium.crypto_secretbox_NONCEBYTES);
  
  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, kek);
};

export const encryptField = (plaintext: string, vaultKey: Uint8Array): { nonce: string; ciphertext: string } => {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(plaintext, nonce, vaultKey);
  
  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext),
  };
};

export const decryptField = (nonce: string, ciphertext: string, vaultKey: Uint8Array): string => {
  const nonceBytes = sodium.from_base64(nonce);
  const ciphertextBytes = sodium.from_base64(ciphertext);
  
  const plaintext = sodium.crypto_secretbox_open_easy(ciphertextBytes, nonceBytes, vaultKey);
  return sodium.to_string(plaintext);
};

export const combineNonceAndCiphertext = (nonce: Uint8Array, ciphertext: Uint8Array): string => {
  const combined = new Uint8Array(nonce.length + ciphertext.length);
  combined.set(nonce);
  combined.set(ciphertext, nonce.length);
  return sodium.to_base64(combined);
};
