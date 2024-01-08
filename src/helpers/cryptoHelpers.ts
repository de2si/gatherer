import CryptoJS from 'crypto-js';

const calculateHash = (base64String: string | null): string | null => {
  try {
    if (base64String) {
      const hash = CryptoJS.SHA256(base64String).toString(CryptoJS.enc.Hex);
      return hash;
    }
    return null;
  } catch (error) {
    console.error('Error computing hash:', error);
    return null;
  }
};

export {calculateHash};
