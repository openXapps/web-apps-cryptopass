// https://www.npmjs.com/package/crypto-js
import CryptoJs from 'crypto-js';

/**
 * Helper function to return date and time in user local
 * @param {date} dIn Date to process
 * @param {boolean} showTime Show or hide time
 * @param {string} showDays Show or hide days (L=left, R=right, H=hide)
 * @returns Date object in user local
 */
export const dateToString = (dIn, showTime, showDays) => {
  // console.log('userDate: dIn....', dIn);
  let dOut = '';
  let diffInTime = 0;
  let diffInDays = 0;
  let today = new Date();
  const d = dIn ? new Date(dIn) : new Date();
  // console.log('userDate: d......', d);
  dOut = d.getFullYear() + '-';
  dOut += String(d.getMonth() + 1).padStart(2, 0) + '-';
  dOut += String(d.getDate()).padStart(2, 0);
  if (showTime) {
    dOut += ' ' + String(d.getHours()).padStart(2, 0) + ':';
    dOut += String(d.getMinutes()).padStart(2, 0);
  }
  if (showDays !== null) {
    diffInTime = today.getTime() - d.getTime();
    diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
    // console.log(diffInDays);
    if(showDays === 'L') dOut = `(${diffInDays}d) ${dOut}`;
    if(showDays === 'R') dOut = `${dOut} (${diffInDays}d)`;
  }
  // console.log('userDate: dOut...', dOut);
  return dOut;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
/**
 * Helper function to copy a string to memory
 * @param {string} text String to copy into memory
 * @returns Boolean of success or failed
 */
export const copyToClipboard = async (text) => {
  let response = false;
  // Doesn't work on IP URL, only localhost and HTTPS
  // stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
  await navigator.clipboard.writeText(text)
    .then(() => { response = true })
    .catch((error) => (response = false));
  return response;
};

/**
 * Helper function to decrypt cipher with CryptoJS
 * @param {string} cipher Encrypted cipher to descrypt
 * @param {string} secret Secret to decrypt cipher
 * @returns Response object { ok: boolean, message: string, value: string }
 */
export const decryptCipher = (cipher, secret) => {
  let response = { ok: false, message: '', value: '' };
  try {
    const bytes = CryptoJs.AES.decrypt(cipher, secret);
    response = { ...response, value: bytes.toString(CryptoJs.enc.Utf8) };
    if (response.value.length > 0) {
      response = { ...response, ok: true };
    } else {
      throw new Error('Invalid secret');
    }
  } catch (error) {
    response = { ...response, message: error.message };
  }
  return response;
};

/**
 * Helper function to encrypt a value with CryptoJS
 * @param {string} value String value to encrypt
 * @param {string} secret Secret to encrypt value
 * @returns Encrypted string
 */
export const encryptString = (value, secret) => {
  return CryptoJs.AES.encrypt(value, secret).toString();
};

/**
 * Helper function to validate string of passwords for upload
 * @param {string} value String value of passwords to validate
 * @returns JavaScript object of validated passwords
 */
export const validateImportString = (value) => {
  let response = { ok: false, result: [], message: '' };

  try {
    response.result = JSON.parse(value);
    response.ok = true;
  } catch (error) {
    response.message = error.message;
  }

  return response;
};

