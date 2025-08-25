import _sodium from 'libsodium-wrappers';

let sodium: typeof _sodium;

export const initSodium = async () => {
  if (!sodium) {
    await _sodium.ready;
    sodium = _sodium;
  }
  return sodium;
};

export const hashPassword = async (password: string): Promise<string> => {
  const sodiumInstance = await initSodium();
  const salt = sodiumInstance.randombytes_buf(sodiumInstance.crypto_pwhash_SALTBYTES);
  const hash = sodiumInstance.crypto_pwhash(
    32,
    password,
    salt,
    sodiumInstance.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodiumInstance.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodiumInstance.crypto_pwhash_ALG_DEFAULT
  );
  
  return sodiumInstance.to_hex(salt) + ':' + sodiumInstance.to_hex(hash);
};
