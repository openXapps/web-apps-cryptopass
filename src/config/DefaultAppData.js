/**
 * DEFAULT DATA FOR INITIAL APP LOAD
 * https://github.com/kelektiv/node-uuid
 */
export const getDefaultData = () => {
  const response = {
    // Local storage items
    storageItems: {
      settings: 'cryptopass-settings',
      categories: 'cryptopass-categories',
      passwords: 'cryptopass-passwords',
    },

    // Navigator bar defaults
    navState: {
      activeNav: -1,
      categoryId: ''
    },

    // Popular slider markers
    popularMarkers: [
      { value: 5, label: '5' },
      { value: 10, label: '10' },
      { value: 15, label: '15' },
      { value: 20, label: '20' },
      { value: 25, label: '25' },
      { value: 30, label: '30' },
    ],

    // cryptopass-settings
    settings: {
      // Remember to update package.json too
      version: '0.1.0',
      themeIsDark: false,
      // themeIsDark: true,
      confirmOnDelete: true,
      popularLimit: 10,
    },

    // cryptopass-categories
    categories: [
      {
        categoryId: '017cf222-887b-11e9-bc42-526af7764f64',
        category: 'Uncategorized',
      },
    ],

    // cryptopass-passwords
    // name.surname@somedomain.com
    // my@awesome@VERY#seCURE-PW
    passwords: [
      {
        categoryId: '017cf222-887b-11e9-bc42-526af7764f64',
        passwordId: '017cf222-887b-11e9-bc42-526af7764f65',
        passwordName: 'Sample (use pass123 to unlock)',
        accountCipher: 'U2FsdGVkX198GbGg850GTkUP1MnEDLlwKRX7u5wQJO/KrvI0DPeSk3mWHoGBWC7u',
        passwordCipher: 'U2FsdGVkX1+safNjGmVaUpxPcZkGRZFJj92Cuo/1llrycOdNK8iWWzpptoIVvxu2',
        favourite: true,
        lastUsed: new Date(),
        lastChanged: new Date(),
      },
    ],
  };
  return response;
};