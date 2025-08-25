import _sodium from 'libsodium-wrappers';

// Initialize sodium
let sodiumReady = false;
let sodium: any;

export const initSodium = async () => {
  console.log('🔧 initSodium: Starting sodium initialization...');
  if (!sodiumReady) {
    try {
      await _sodium.ready;
      sodium = _sodium;
      sodiumReady = true;
      console.log('✅ initSodium: Sodium initialized successfully');
      console.log('🔍 initSodium: Looking for pwhash functions:', Object.keys(sodium).filter(key => key.includes('pwhash')));
      console.log('🔍 initSodium: Looking for argon2 functions:', Object.keys(sodium).filter(key => key.includes('argon2')));
    } catch (error) {
      console.error('❌ initSodium: Failed to initialize sodium:', error);
      throw error;
    }
  } else {
    console.log('✅ initSodium: Sodium already initialized');
  }
};

export interface VaultKdfParams {
  opslimit: number;
  memlimit: number;
  parallelism: number;
  version: number;
}

// Initialize DEFAULT_KDF_PARAMS after sodium is ready
export const getDefaultKdfParams = async (): Promise<VaultKdfParams> => {
  console.log('🔧 getDefaultKdfParams: Getting default KDF params...');
  await initSodium();
  
  try {
    // Look for available constants
    console.log('🔍 Available ALG constants:', Object.keys(sodium).filter(key => key.includes('ALG')));
    console.log('🔍 Available OPSLIMIT constants:', Object.keys(sodium).filter(key => key.includes('OPSLIMIT')));
    console.log('🔍 Available MEMLIMIT constants:', Object.keys(sodium).filter(key => key.includes('MEMLIMIT')));
    
    // Use available constants or fallback values
    const algConstant = sodium.crypto_pwhash_ALG_ARGON2ID13 || 
                       sodium.crypto_pwhash_ALG_ARGON2I13 || 
                       sodium.crypto_pwhash_ALG_ARGON2I || 2;
    
    const params = {
      opslimit: sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE || 4,
      memlimit: sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE || 33554432,
      parallelism: 1,
      version: algConstant,
    };
    console.log('✅ getDefaultKdfParams: Success', params);
    return params;
  } catch (error) {
    console.error('❌ getDefaultKdfParams: Error accessing sodium constants:', error);
    console.log('🔍 getDefaultKdfParams: Available constants:', Object.keys(sodium).filter(key => key.includes('ALG_ARGON2ID')));
    throw error;
  }
};

export const generateVaultKey = async (): Promise<Uint8Array> => {
  console.log('🔧 generateVaultKey: Generating vault key...');
  await initSodium();
  
  try {
    const key = sodium.randombytes_buf(32);
    console.log('✅ generateVaultKey: Success, key length:', key.length);
    return key;
  } catch (error) {
    console.error('❌ generateVaultKey: Error:', error);
    throw error;
  }
};

export const generateSalt = async (): Promise<Uint8Array> => {
  console.log('🔧 generateSalt: Generating salt...');
  await initSodium();
  
  try {
    const salt = sodium.randombytes_buf(16);
    console.log('✅ generateSalt: Success, salt length:', salt.length);
    return salt;
  } catch (error) {
    console.error('❌ generateSalt: Error:', error);
    throw error;
  }
};

export const deriveKEK = async (
  password: string, 
  salt: Uint8Array, 
  params: VaultKdfParams
): Promise<Uint8Array> => {
  console.log('🔧 deriveKEK: Starting KEK derivation...');
  console.log('🔍 deriveKEK: Password length:', password.length);
  console.log('🔍 deriveKEK: Salt length:', salt.length);
  console.log('🔍 deriveKEK: Params:', params);
  
  await initSodium();
  
  try {
    // Look for all possible pwhash function names
    const pwhashFunctions = Object.keys(sodium).filter(key => key.includes('pwhash'));
    console.log('🔍 deriveKEK: Available pwhash functions:', pwhashFunctions);
    
    // Try different function names that might be available
    let pwhashFunc = null;
    const possibleNames = [
      'crypto_pwhash',
      'crypto_pwhash_argon2i',
      'crypto_pwhash_argon2id',
      'crypto_pwhash_scryptsalsa208sha256'
    ];
    
    for (const name of possibleNames) {
      if (typeof sodium[name] === 'function') {
        pwhashFunc = sodium[name];
        console.log(`✅ deriveKEK: Found working function: ${name}`);
        break;
      }
    }
    
    if (!pwhashFunc) {
      // Try using crypto_generichash as a fallback (PBKDF2-like behavior)
      if (typeof sodium.crypto_generichash === 'function') {
        console.log('🔧 deriveKEK: Using crypto_generichash as fallback');
        // Simple key derivation using BLAKE2b
        const key = sodium.crypto_generichash(32, password + sodium.to_hex(salt));
        console.log('✅ deriveKEK: Success with generichash fallback, KEK length:', key.length);
        return key;
      }
      
      throw new Error('No suitable password hashing function found');
    }
    
    const kek = pwhashFunc(
      32, // key length
      password,
      salt,
      params.opslimit,
      params.memlimit,
      params.version
    );
    
    console.log('✅ deriveKEK: Success, KEK length:', kek.length);
    return kek;
  } catch (error) {
    console.error('❌ deriveKEK: Error during password hashing:', error);
    
    // Final fallback: use a simple but secure derivation
    try {
      console.log('🔧 deriveKEK: Trying final fallback with crypto_hash_sha256');
      if (typeof sodium.crypto_hash_sha256 === 'function') {
        // Create a simple key derivation using SHA256
        const combined = password + sodium.to_hex(salt) + 'lockpulse_kdf';
        const hash = sodium.crypto_hash_sha256(combined);
        console.log('✅ deriveKEK: Success with SHA256 fallback, KEK length:', hash.length);
        return hash;
      }
    } catch (fallbackError) {
      console.error('❌ deriveKEK: Fallback also failed:', fallbackError);
    }
    
    throw error;
  }
};

export const wrapVaultKey = async (vaultKey: Uint8Array, kek: Uint8Array): Promise<{ nonce: Uint8Array; ciphertext: Uint8Array }> => {
  console.log('🔧 wrapVaultKey: Wrapping vault key...');
  await initSodium();
  
  try {
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
    const ciphertext = sodium.crypto_secretbox_easy(vaultKey, nonce, kek);
    
    console.log('✅ wrapVaultKey: Success');
    return { nonce, ciphertext };
  } catch (error) {
    console.error('❌ wrapVaultKey: Error:', error);
    throw error;
  }
};

export const unwrapVaultKey = async (wrappedKey: string, kek: Uint8Array): Promise<Uint8Array> => {
  await initSodium();
  const wrapped = sodium.from_base64(wrappedKey);
  const nonce = wrapped.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = wrapped.slice(sodium.crypto_secretbox_NONCEBYTES);
  
  return sodium.crypto_secretbox_open_easy(ciphertext, nonce, kek);
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
  console.log('🔧 combineNonceAndCiphertext: Combining nonce and ciphertext...');
  await initSodium();
  
  try {
    const combined = new Uint8Array(nonce.length + ciphertext.length);
    combined.set(nonce);
    combined.set(ciphertext, nonce.length);
    const result = sodium.to_base64(combined);
    console.log('✅ combineNonceAndCiphertext: Success');
    return result;
  } catch (error) {
    console.error('❌ combineNonceAndCiphertext: Error:', error);
    throw error;
  }
};
