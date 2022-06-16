import { getDefaultData } from '../config/DefaultAppData';

/**
 * Overwrite item to local storage
 * @param {string} item Local storage identifier
 * @param {any} data Data object to store
 */
export const saveLocalStorage = (item, data) => {
  try {
    localStorage.setItem(item, JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
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
    saveLocalStorage(getDefaultData().storageItems.passwords, newPasswords);
  }
};

/**
 * Helper function to update a single password object
 * @param {any} password Password object to update
 */
export const updatePassword = (password) => {
  const passwords = getPasswords();

  if (passwords.statusOK) {
    const newPasswords = passwords.data.map((v, i) => {
      return (v.passwordId === password.passwordId ? (password) : (v));
    });
    // console.log('updatePassword: newPasswords...', newPasswords);
    saveLocalStorage(getDefaultData().storageItems.passwords, newPasswords);
  }
};

/**
 * Helper function to update a single category object
 * @param {any} category Category object to update
 */
export const updateCategory = (category) => {
  const categories = getCategories();

  if (categories.statusOK) {
    const newCategories = categories.data.map((v, i) => {
      return (v.categoryId === category.categoryId ? (category) : (v));
    });
    // console.log('updateCategory: newCategories...', newCategories);
    saveLocalStorage(getDefaultData().storageItems.categories, newCategories);
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
    saveLocalStorage(getDefaultData().storageItems.passwords, passwords.data);
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
    saveLocalStorage(getDefaultData().storageItems.passwords, newPasswords);
  }
};

/**
 * Helper function to delete a single category object
 * @param {string} categoryId Category Id to delete
 */
export const deleteCategory = (categoryId) => {
  const categories = getCategories();
  let splicePoint = -1;

  if (categories.statusOK) {
    const newCategories = categories.data;
    categories.data.forEach((v, i) => {
      if (v.categoryId === categoryId) splicePoint = i;
      return;
    });
    newCategories.splice(splicePoint, 1);
    // console.log('deleteCategory: splicePoint.....', splicePoint);
    // console.log('deleteCategory: newCategories...', newCategories);
    saveLocalStorage(getDefaultData().storageItems.categories, newCategories);
  }
};

/**
 * Helper function to add a new category object
 * @param {any} category Category object to add
 */
export const addCategory = (category) => {
  let categories = getCategories();

  if (categories.statusOK) {
    categories.data.push(category);
    // console.log('addCategory: categories.data...', categories.data);
    saveLocalStorage(getDefaultData().storageItems.categories, categories.data);
  }
};

/**
 * Get SETTINGS from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getSettings = () => {
  let response = {
    statusOK: false,
    data: getDefaultData().settings,
  };
  try {
    const settings = JSON.parse(localStorage.getItem(getDefaultData().storageItems.settings));
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
 * Get FILTERED PASSWORDS from local storage
 * @param {any} filter Context state or current category
 * @param {number} limit [optional] Number of passwords to return
 * @returns Returns an object {statusOk: boolean, data: any}
 */
// {
//   "activeNav": 0,
//   "categoryId": "037cf222-887b-11e9-bc42-526af7764f64"
// }
export const filterPasswords = (filter, limit) => {
  let response = { statusOK: false, data: [] };
  let result = [];
  const { activeNav, categoryId } = filter;
  const listLimit = limit && limit > 0 ? limit : getSettings().data.popularLimit;
  try {
    const data = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
    if (data) {
      if (activeNav === -1) {
        result = data.map((v) => {
          return { ...v, category: getCategoryById(v.categoryId).data[0].category };
        });
        response = {
          statusOK: true,
          data: result.sort((a, b) => (a.lastUsed < b.lastUsed) ? 1 : -1)
        };
      }
      if (activeNav === -2) {
        result = data.filter((v) => v.favourite);
        result = result.map((v) => {
          return { ...v, category: getCategoryById(v.categoryId).data[0].category };
        });
        response = {
          statusOK: true,
          data: result.sort((a, b) => (a.passwordName > b.passwordName) ? 1 : -1)
        };
      }
      if (activeNav > -1 && categoryId) {
        result = data.filter((v) => v.categoryId === categoryId);
        response = {
          statusOK: true,
          data: result.sort((a, b) => (a.passwordName > b.passwordName) ? 1 : -1)
        };
      }
      if (response.data.length > 0 && listLimit > 0) {
        // console.log('filterPasswords: slicing response by...', listLimit);
        response = { ...response, data: response.data.slice(0, listLimit) };
      }
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('filterPasswords: error...', error);
  }
  // console.log('filterPasswords: response..............', response);
  return response;
};

/**
 * Get FAVOURITES from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getFavourites = () => {
  let response = {
    statusOK: false,
    data: []
  };
  try {
    const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
    if (passwords) {
      const favourites = passwords.filter((v) => v.favourite);
      if (favourites.length > 0) {
        const newPasswords = favourites.map((v) => {
          return { ...v, category: getCategoryById(v.categoryId).data[0].category };
        });
        response = {
          statusOK: true,
          data: newPasswords.sort((a, b) => (a.passwordName > b.passwordName) ? 1 : -1)
        };
      }
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getFavourites: error...', error);
  }
  return response;
};

/**
 * Get POPULAR from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getPopular = () => {
  let response = { statusOK: false, data: [] };
  try {
    const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
    console.log('getPopular: passwords...', passwords);
    if (passwords) {
      const newPasswords = passwords.map((v) => {
        return { ...v, category: getCategoryById(v.categoryId).data[0].category };
      });
      response = {
        statusOK: true,
        data: newPasswords.sort((a, b) => (a.lastUsed < b.lastUsed) ? 1 : -1)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getPopular: error...', error);
  }
  return response;
};

/**
 * Get PASSWORDS by CATEGORY from local storage
 * @param {string} categoryId Category Id to search for
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getByCategory = (categoryId) => {
  let response = { statusOK: false, data: [] };
  let byCategory = [];
  try {
    const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
    if (passwords) {
      byCategory = passwords.filter((v) => v.categoryId === categoryId);
      if (byCategory.length > 0) {
        response = {
          statusOK: true,
          data: byCategory.sort((a, b) => (a.passwordName > b.passwordName) ? 1 : -1)
        };
      }
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getByCategory: error...', error);
  }
  return response;
};

/**
 * Get CATEGORIES from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getCategories = () => {
  let response = { statusOK: false, data: [] };
  try {
    const categories = JSON.parse(localStorage.getItem(getDefaultData().storageItems.categories));
    if (categories) {
      response = {
        statusOK: true,
        data: categories.sort((a, b) => (a.category > b.category) ? 1 : -1)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getCategories: error...', error);
  }
  return response;
};

/**
 * Get CATEGORIES with password count from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getCategoriesWithCount = () => {
  let response = { statusOK: false, data: [] };
  let categoriesWithCount = [{ categoryId: '', category: '', numOfPasswords: 0 }];
  const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
  try {
    const categories = JSON.parse(localStorage.getItem(getDefaultData().storageItems.categories));
    if (categories.length > 0 && passwords.length > 0) {
      categories.forEach((v) => {
        categoriesWithCount.push({
          categoryId: v.categoryId,
          category: v.category,
          numOfPasswords: getPasswordCount(v.categoryId, passwords)
        });
      });
      response = {
        statusOK: true,
        data: categoriesWithCount.sort((a, b) => (a.category > b.category) ? 1 : -1)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getCategoriesWithCount: error...', error);
  }
  return response;
};

/**
 * Helper function to count number of passwords per category
 * @param {string} categoryId Category Id to use
 * @param {any} passwords Passwords to map
 * @returns Number of passwords per category
 */
export const getPasswordCount = (categoryId, passwords) => {
  let counter = 0;
  if (passwords) {
    passwords.forEach((v) => {
      if (v.categoryId === categoryId) counter += 1;
    });
  }
  return counter;
};

/**
 * Get CATEGORY by NAME from local storage
 * @param {string} value Category name to search for
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getCategoryByName = (category) => {
  let response = { statusOK: false, data: [] };
  try {
    const categories = JSON.parse(localStorage.getItem(getDefaultData().storageItems.categories));
    if (categories) {
      response = {
        statusOK: true,
        data: categories.filter((v) => v.category === category)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getCategoryByName: error...', error);
  }
  return response;
};

/**
 * Get CATEGORY by ID from local storage
 * @param {string} categoryId Category Id to search for
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getCategoryById = (categoryId) => {
  let response = { statusOK: false, data: [] };
  try {
    const categories = JSON.parse(localStorage.getItem(getDefaultData().storageItems.categories));
    if (categories) {
      response = {
        statusOK: true,
        data: categories.filter((v) => v.categoryId === categoryId)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getCategoryById: error...', error);
  }
  return response;
};

/**
 * Get PASSWORDS from local storage
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getPasswords = () => {
  let response = { statusOK: false, data: [] };
  try {
    const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
    if (passwords) {
      response = {
        statusOK: true,
        data: passwords.sort((a, b) => (a.passwordName > b.passwordName) ? 1 : -1)
      };
    } else {
      throw new Error('No items found in localStorage');
    }
  } catch (error) {
    console.log('getPasswords: error...', error);
  }
  return response;
};

/**
 * Get PASSWORD by ID from local storage
 * @param {string} passwordId Password Id to search for
 * @returns Returns an object {statusOk: boolean, data: any}
 */
export const getPasswordById = (passwordId) => {
  let response = { statusOK: false, data: [], };
  try {
    const passwords = JSON.parse(localStorage.getItem(getDefaultData().storageItems.passwords));
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
  return response;
};

/**
 * Get DOWNLOADABLE data from storage
 */
export const getDownloadableData = () => {
  let data = '{\n"categories":\n';
  data += stringPop(JSON.stringify(getCategories().data));
  // data += ',\n"popular":\n';
  // data += stringPop(JSON.stringify(getPopular().data));
  // data += ',\n"favourites":\n';
  // data += stringPop(JSON.stringify(getFavourites().data));
  data += ',\n"passwords":\n';
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
  result = result.replace(/},{/g, '},\n{');
  return result;
}