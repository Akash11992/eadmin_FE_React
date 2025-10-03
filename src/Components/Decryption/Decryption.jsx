import CryptoJS from 'crypto-js';

const Decryption = () => {
  const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY; 

  const decryptData = (encryptedData) => {
    const [ivHex, encryptedTextHex] = encryptedData.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex); 
    const encryptedText = CryptoJS.enc.Hex.parse(encryptedTextHex); 
    const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY); 
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedText },
      key,
      { iv: iv }
    );
    const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  };
  return decryptData
};

export default Decryption;
