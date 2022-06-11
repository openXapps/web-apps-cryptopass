import { useState } from 'react';

// https://www.npmjs.com/package/crypto-js
import CryptoJs from 'crypto-js';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function CryptoTest() {
  const [password, setPassword] = useState('my@awesome@VERY#seCURE-PW');
  const [secret, setSecret] = useState('mysecret');
  const [ciphertext, setCiphertext] = useState('');
  const [originalPassword, setOriginalPassword] = useState('');

  const handleEncrypt = () => {
    // console.log('encryptedValue...', CryptoJs.AES.encrypt(password, secret).toString());
    setCiphertext(CryptoJs.AES.encrypt(password, secret).toString());
    setOriginalPassword('');
  };

  const handleDecrypt = () => {
    const bytes = CryptoJs.AES.decrypt(ciphertext, secret);
    // console.log('originalPassword.....', bytes.toString(CryptoJs.enc.Utf8));
    setOriginalPassword(bytes.toString(CryptoJs.enc.Utf8));
  };

  return (
    <Stack spacing={2} mt={3}>
      <TextField label="Password" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} />
      <TextField label="Secret" variant="outlined" value={secret} onChange={(e) => setSecret(e.target.value)} />
      <TextField label="Cipher Value" variant="outlined" value={ciphertext} />
      <TextField label="Original Password" variant="outlined" value={originalPassword} />
      <Box mt={2}>
        <Button onClick={handleEncrypt}>Encrypt</Button>
        <Button sx={{ ml: 2 }} onClick={handleDecrypt}>Decrypt</Button>
      </Box>
    </Stack>
  );
}

export default CryptoTest;