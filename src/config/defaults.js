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
  version: '0.1.1',
  // version: '0.1.0',
  // themeIsDark: false,
  themeIsDark: true,
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
    passwordId: '3f06d370-0c12-11ed-ae72-e1ce8082c3c0',
    passwordTitle: 'Dropbox (123 to unlock)',
    accountCipher: 'U2FsdGVkX18UkooE1O/HwnEBl5lJqE8VekjxXi4P9pzEPYu7kM/gdzJ53atEkF3H',
    passwordCipher: 'U2FsdGVkX1/Kh7o4GNi+++PvLQKiJrdk5GgsUKrFJbdf2P1RcF866zJb412DRh4l',
    lastUsed: new Date('2022-07-01 13:22'),
    lastChanged: new Date('2022-05-15 07:12'),
  },
  {
    passwordId: '3f06d370-0c12-11ed-ae72-e1ce8082c3c1',
    passwordTitle: 'Google (123 to unlock)',
    accountCipher: 'U2FsdGVkX18UkooE1O/HwnEBl5lJqE8VekjxXi4P9pzEPYu7kM/gdzJ53atEkF3H',
    passwordCipher: 'U2FsdGVkX1/Kh7o4GNi+++PvLQKiJrdk5GgsUKrFJbdf2P1RcF866zJb412DRh4l',
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
