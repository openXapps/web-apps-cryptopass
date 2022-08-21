import { cryptopassSettings, storageItems } from '../config/defaults';

/**
 * Overwrite item to local storage
 * @param {string} item Local storage identifier
 * @param {any} data Data object to store
 */
export const saveLocalStorage = (item, data) => {
  try {
    localStorage.setItem(item, JSON.stringify(data));
  } catch (error) {
    console.log('saveLocalStorage: error...', error);
  }
};

/**
 * Get SETTINGS from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getSettings = () => {
  let response = { statusOK: false, data: cryptopassSettings };
  try {
    const settings = JSON.parse(localStorage.getItem(storageItems.settings));
    if (settings) {
      response = {
        statusOK: true,
        data: settings
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getSettings: error...', error);
  }
  return response;
};

/**
 * Get PASSWORDS from local storage
 * @param {string} search Optional string value to filter on
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getPasswords = (search) => {
  let response = { statusOK: false, data: [] };
  const sortOrder = getSettings().data.sortOrder;
  try {
    const passwords = JSON.parse(localStorage.getItem(storageItems.passwords));
    if (passwords) {
      if (search) {
        response = {
          statusOK: true,
          data: passwords.filter((v) => {
            return (v.passwordTitle.toLowerCase().indexOf(search.toLowerCase()) > -1);
          })
        }
      } else {
        response = {
          statusOK: true,
          data: sortOrder === 10
            ? passwords.sort((a, b) => (a.lastUsed < b.lastUsed) ? 1 : -1)
            : passwords.sort((a, b) => (a.passwordTitle < b.passwordTitle) ? 1 : -1)
        };
      }
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getPasswords: error...', error);
  }
  return response;
};

/**
 * Helper function to update a password's last used date
 * @param {string} passwordId Password ID to lookup
 */
export const updateLastClicked = (passwordId) => {
  const passwords = getPasswords();

  if (passwords.statusOK) {
    const newPasswords = passwords.data.map((v, i) => {
      return (v.passwordId === passwordId ?
        (
          { ...v, lastUsed: new Date() }
        ) : (v)
      );
    });
    saveLocalStorage(storageItems.passwords, newPasswords);
  }
};

/**
 * Helper function to update a single password object
 * @param {string} passwordId Password ID to update
 * @param {any} newPassword Password object to update
 */
export const updatePassword = (passwordId, newPassword) => {
  const passwords = getPasswords();

  if (passwords.statusOK) {
    const newPasswords = passwords.data.map((v, i) => {
      return (v.passwordId === passwordId ? (newPassword) : (v));
    });
    // console.log('updatePassword: newPasswords...', newPasswords);
    saveLocalStorage(storageItems.passwords, newPasswords);
  }
};

/**
 * Helper function to add a new password object
 * @param {any} password Password object to add
 */
export const addPassword = (password) => {
  let passwords = getPasswords();

  if (passwords.statusOK) {
    passwords.data.push(password);
    // console.log('addPassword: passwords.data...', passwords.data);
    saveLocalStorage(storageItems.passwords, passwords.data);
  }
};

/**
 * Helper function to delete a single password object
 * @param {string} passwordId Password Id to delete
 */
export const deletePassword = (passwordId) => {
  const passwords = getPasswords();
  let splicePoint = -1;

  if (passwords.statusOK) {
    const newPasswords = passwords.data;
    passwords.data.forEach((v, i) => {
      if (v.passwordId === passwordId) splicePoint = i;
      return;
    });
    newPasswords.splice(splicePoint, 1);
    // console.log('deletePassword: splicePoint....', splicePoint);
    // console.log('deletePassword: newPasswords...', newPasswords);
    saveLocalStorage(storageItems.passwords, newPasswords);
  }
};

/**
 * Get PASSWORD by ID from local storage
 * @param {string} passwordId Password Id to search for
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getPasswordById = (passwordId) => {
  let response = { statusOK: false, data: {} };
  try {
    const passwords = JSON.parse(localStorage.getItem(storageItems.passwords));
    if (passwords) {
      response = {
        statusOK: true,
        data: passwords.filter((v) => v.passwordId === passwordId)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getPasswordById: error...', error);
  }
  // console.log('getPasswordById: response', response);
  return response;
};

/**
 * Get DOWNLOADABLE data from storage
 * @returns String of downloadable data
 */
export const getDownloadableData = () => {
  let data = '{\n"passwords":\n';
  data += stringPop(JSON.stringify(getPasswords().data));
  data += '\n}';
  return data;
};

/**
 * Helper function to prettify JSON object
 * @param {string} data String to prettify
 */
function stringPop(data) {
  let result = data;
  result = result.replace('[', '[\n');
  result = result.replace(']', '\n]');
  result = result.replace(/","/g, '",\n"');
  result = result.replace(/},{/g, '},\n{');
  return result;
}