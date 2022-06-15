import { getDefaultData } from '../config/DefaultAppData';
import { saveLocalStorage } from './localstorage';

/**
* Write initial storage on first time usage
 */
export const initialUse = () => {
  // TODO: Replace with local storage getters
  const settings = { statusOK: false };
  const categories = { statusOK: false };
  const passwords = { statusOK: false };

  // No settings exist
  if (!settings.statusOK) {
    saveLocalStorage(getDefaultData().storageItems.settings, getDefaultData().settings);
  }

  // No categories exist
  if (!categories.statusOK) {
    saveLocalStorage(getDefaultData().storageItems.categories, getDefaultData().categories);
  }

  // No bookamrks exist
  if (!passwords.statusOK) {
    saveLocalStorage(getDefaultData().storageItems.passwords, getDefaultData().passwords);
  }
};