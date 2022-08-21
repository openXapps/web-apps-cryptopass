import { storageItems, cryptopassPasswords, cryptopassSettings } from '../config/defaults';
import { saveLocalStorage, getSettings, getPasswords } from './localstorage';

/**
* Write initial storage on first usage
 */
export const initialUse = () => {
  let doVersionBump = true;
  const settings = getSettings();
  const passwords = getPasswords();

  // No settings exist
  if (!settings.statusOK) {
    saveLocalStorage(storageItems.settings, cryptopassSettings);
  }

  // No sample passwords exist
  if (!passwords.statusOK) {
    saveLocalStorage(storageItems.passwords, cryptopassPasswords);
  }

  // Version 0.1.5 update
  if (settings.statusOK && !settings.data.sortOrder && cryptopassSettings.version.indexOf('0.1.5') > -1) {
    saveLocalStorage(storageItems.settings, {
      ...settings.data,
      version: cryptopassSettings.version,
      sortOrder: cryptopassSettings.sortOrder
    });
    doVersionBump = false;
  }

  // Version 0.1.1 to 0.1.2
  if (settings.statusOK && settings.data.version.indexOf('0.1.1') > -1 && cryptopassSettings.version.indexOf('0.1.2') > -1) {
    saveLocalStorage(storageItems.settings, {
      ...settings.data,
      version: cryptopassSettings.version,
      passwordListIsDense: cryptopassSettings.passwordListIsDense
    });
    doVersionBump = false;
  }

  // Bump version
  if (doVersionBump && settings.statusOK && settings.data.version.indexOf(cryptopassSettings.version) === -1) {
    saveLocalStorage(storageItems.settings, { ...settings.data, version: cryptopassSettings.version });
  }

};