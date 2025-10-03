import CryptoJS from 'crypto-js';

const Encryption = () => {
    
    const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY; 

  const encryptData = (data) => {
    const iv = CryptoJS.lib.WordArray.random(16); // Generate a random IV
    const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv: iv,
    });

    // Combine IV and encrypted text as a hex string
    const encryptedData = `${iv.toString(
      CryptoJS.enc.Hex
    )}:${encrypted.ciphertext.toString(CryptoJS.enc.Hex)}`;
    return encryptedData;
  };

  return encryptData;
};

export default Encryption;
