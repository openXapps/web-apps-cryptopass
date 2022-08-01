import { storageItems, cryptopassPasswords, cryptopassSettings } from '../config/defaults';
import { saveLocalStorage, getSettings, getPasswords } from './localstorage';

/**
* Write initial storage on first usage
 */
export const initialUse = () => {
  const settings = getSettings();
  const passwords = getPasswords();

  // No settings exist
  if (!settings.statusOK) {
    saveLocalStorage(storageItems.settings, cryptopassSettings);
  }

  // No passworda exist
  if (!passwords.statusOK) {
    saveLocalStorage(storageItems.passwords, cryptopassPasswords);
  }

  // Bump version
  if (settings.statusOK && settings.data.version.indexOf(cryptopassSettings.version) === -1) {
    saveLocalStorage(storageItems.settings, { ...settings.data, version: cryptopassSettings.version });
  }

};