import { getDefaultData } from '../config/DefaultAppData';
import { saveLocalStorage, getSettings, getCategories, getPasswords } from './LocalStorage';

/**
* Write initial storage on first time usage
 */
export const initialUse = () => {
  const settings = getSettings();
  const categories = getCategories();
  const passwords = getPasswords();

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