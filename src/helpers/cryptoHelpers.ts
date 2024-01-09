import CryptoJS from 'crypto-js';

const calculateMD5Hash = (base64String: string | null): string | null => {
  try {
    if (base64String) {
      const hash = CryptoJS.MD5(base64String).toString(CryptoJS.enc.Hex);
      return hash;
    }
    return null;
  } catch (error) {
    console.error('Error computing hash:', error);
    return null;
  }
};

// SHA3-224: 224 bits / 4 bits per character = 56 characters
// SHA3-256: 256 bits / 4 bits per character = 64 characters
// SHA3-384: 384 bits / 4 bits per character = 96 characters
// SHA3-512: 512 bits / 4 bits per character = 128 characters
type SHA3_LENGTH = 224 | 256 | 384 | 512;
const calculateHash = (
  base64String: string | null,
  outputLength: SHA3_LENGTH = 512,
): string | null => {
  try {
    if (base64String) {
      const hash = CryptoJS.SHA3(base64String, {outputLength}).toString(
        CryptoJS.enc.Hex,
      );
      return hash;
    }
    return null;
  } catch (error) {
    console.error('Error computing hash:', error);
    return null;
  }
};

export {calculateHash, calculateMD5Hash};
