// src/utils/crypto.js

/**
 * Generates an encryption key from a user-provided password using PBKDF2.
 * This key is NEVER stored in Supabase, only in local memory or sessionStorage.
 */
export async function generateKeyFromPassword(password, saltString = 'seedlab_enterprise_salt') {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const salt = enc.encode(saltString);

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return key;
}

/**
 * Encrypts a plaintext string (e.g., genetic lineage) using AES-GCM.
 * Returns a base64 encoded string containing the IV and the Ciphertext, separated by a colon.
 */
export async function encryptData(plaintext, key) {
  const enc = new TextEncoder();
  const encoded = enc.encode(plaintext);
  
  // The Initialization Vector (IV) must be unique for every encryption
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    encoded
  );

  const ciphertextArray = Array.from(new Uint8Array(ciphertextBuffer));
  const ciphertextBase64 = btoa(String.fromCharCode.apply(null, ciphertextArray));
  
  const ivArray = Array.from(iv);
  const ivBase64 = btoa(String.fromCharCode.apply(null, ivArray));

  // We store them together: IV:CIPHERTEXT
  return `${ivBase64}:${ciphertextBase64}`;
}

/**
 * Decrypts a base64 encoded string (IV:CIPHERTEXT) back to plaintext.
 */
export async function decryptData(encryptedString, key) {
  if (!encryptedString || !encryptedString.includes(':')) {
    throw new Error('Invalid encrypted string format. Expected IV:CIPHERTEXT');
  }

  const [ivBase64, ciphertextBase64] = encryptedString.split(':');
  
  const ivString = atob(ivBase64);
  const iv = new Uint8Array(ivString.length);
  for (let i = 0; i < ivString.length; i++) {
    iv[i] = ivString.charCodeAt(i);
  }

  const ciphertextString = atob(ciphertextBase64);
  const ciphertext = new Uint8Array(ciphertextString.length);
  for (let i = 0; i < ciphertextString.length; i++) {
    ciphertext[i] = ciphertextString.charCodeAt(i);
  }

  try {
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (e) {
    console.error('Decryption failed. Incorrect key or tampered data.', e);
    return '*** ENCRYPTED DATA (KEY REQUIRED) ***';
  }
}
