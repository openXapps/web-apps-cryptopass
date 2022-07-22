/**
 * DEFAULT DATA FOR INITIAL APP LOAD
 */

// Local storage object names
export const storageItems = {
  settings: 'cryptopass-settings',
  passwords: 'cryptopass-passwords',
};

/**
 * Local storage app settings
 * cryptopass-settings
 */
export const cryptopassSettings = {
  // Remember to update package.json with version
  version: '0.1.0',
  themeIsDark: false,
  // themeIsDark: true,
  confirmOnDelete: true,
  passwordLengthMarker: 10,
};

/**
 * Local storage default password on first use
 * cryptopass-passwords
 * name.surname@somedomain.com
 * my@awesome@VERY#seCURE-PW
 */
export const cryptopassPasswords = [
  {
    passwordId: '017cf222-887b-11e9-bc42-526af7764f65',
    passwordTitle: 'Dropbox (use pass123 to unlock)',
    accountCipher: 'U2FsdGVkX198GbGg850GTkUP1MnEDLlwKRX7u5wQJO/KrvI0DPeSk3mWHoGBWC7u',
    passwordCipher: 'U2FsdGVkX1+safNjGmVaUpxPcZkGRZFJj92Cuo/1llrycOdNK8iWWzpptoIVvxu2',
    lastUsed: new Date('2022-07-01 13:22'),
    lastChanged: new Date('2022-05-15 07:12'),
  },
  {
    passwordId: '017cf222-887b-11e9-bc42-526af7764f64',
    passwordTitle: 'Google (use pass123 to unlock)',
    accountCipher: 'U2FsdGVkX198GbGg850GTkUP1MnEDLlwKRX7u5wQJO/KrvI0DPeSk3mWHoGBWC7u',
    passwordCipher: 'U2FsdGVkX1+safNjGmVaUpxPcZkGRZFJj92Cuo/1llrycOdNK8iWWzpptoIVvxu2',
    lastUsed: new Date('2022-07-09 07:15'),
    lastChanged: new Date('2021-03-12 15:01'),
  },
];

// Password length slider markers
export const passwordLengthMarkers = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 25, label: '25' },
  { value: 30, label: '30' },
];
