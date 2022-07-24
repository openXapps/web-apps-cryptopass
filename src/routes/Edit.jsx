import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { getPasswordById, updatePassword } from '../helpers/localstorage';
import { dateToString, decryptCipher, encryptString } from '../helpers/utilities';
import { storageItems } from '../config/defaults';

const initialFieldData = {
  passwordId: uuidv1(),
  passwordTitle: '',
  accountCipher: '',
  passwordCipher: '',
  lastUsed: new Date(),
  lastChanged: new Date(),
  accountName: '',
  accountPassword: '',
  accountSecret: ''
};

function Edit() {
  const rrNavigate = useNavigate();
  const rrPath = useLocation().pathname;
  const { passwordId } = useParams();
  const [mode, setMode] = useState('');
  const [header, setHeader] = useState('');
  const [fields, setFields] = useState(initialFieldData);
  // const [secret, setSecret] = useState('');
  const [decryptError, setDecryptError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    // console.log('Edit effect render');
    if (rrPath === '/edit/new') {
      setMode('NEW');
      setHeader('Create New Password');
    } else {
      if (passwordId) {
        setMode('EDIT');
        setHeader('Edit Password');
        setIsLocked(true);
        let password = getPasswordById(passwordId).data;
        if (password.length > 0) setFields({
          accountName: '***************************',
          accountPassword: '***************************',
          accountSecret: '',
          passwordId: passwordId,
          passwordTitle: password[0].passwordTitle,
          accountCipher: password[0].accountCipher,
          passwordCipher: password[0].passwordCipher,
          lastUsed: password[0].lastUsed,
          lastChanged: password[0].lastChanged,
        });
      }
    }
    return () => true;
  }, [rrPath, passwordId]);

  const handleFieldChange = ({ target: { name, value } }) => {
    setFields({ ...fields, [name]: value });
    if (isSaved && name !== 'accountSecret') setIsSaved(false);
    if (decryptError) setDecryptError(false);
  };

  const handleUnlockButton = (e) => {
    e.preventDefault();
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
    // console.log('passwordUnlockSecret...', passwordUnlockSecret);
    if (fields.accountSecret.length > 0) {
      _username = decryptCipher(fields.accountCipher, fields.accountSecret);
      _password = decryptCipher(fields.passwordCipher, fields.accountSecret);
      // console.log('_username...', _username);
      // console.log('_password...', _password);
      if (_username.ok && _password.ok) {
        // console.log('Decryption good');
        setFields(prevState => {
          return {
            ...prevState,
            accountName: _username.value,
            accountPassword: _password.value
          };
        });
        // handleDialogClose();
        if (decryptError) setDecryptError(false);
        setIsLocked(false);
      } else {
        // console.log('Decryption failed');
        if (!decryptError) setDecryptError(true);
        if (isLocked) setIsLocked(true);
      }
    } else {
      // console.log('Invalid accountSecret');
      if (!decryptError) setDecryptError(true);
      if (isLocked) setIsLocked(true);
    }
  };

  const handleSaveButton = (e) => {
    // ToDo: form validation
    let isFormValid = true
    let passwordToSave = {};
    if (fields.accountSecret.length > 0 && isFormValid) {
      passwordToSave = {
        passwordId: fields.passwordId,
        passwordTitle: fields.passwordTitle,
        accountCipher: encryptString(fields.accountName, fields.accountSecret),
        passwordCipher: encryptString(fields.accountPassword, fields.accountSecret),
        lastUsed: new Date(fields.lastUsed),
        lastChanged: new Date(),
      };
      console.log('passwordToSave...', passwordToSave);
      updatePassword(passwordToSave);
      setIsSaved(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Typography variant="h6" sx={{ mt: 2 }}>{header}</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            variant="outlined"
            name="passwordTitle"
            autoComplete="off"
            value={fields.passwordTitle}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="Account"
            variant="outlined"
            name="accountName"
            autoComplete="off"
            value={fields.accountName}
            onChange={handleFieldChange}
            fullWidth
          />
          <TextField
            label="Password"
            variant="outlined"
            name="accountPassword"
            // type="password"
            autoComplete="off"
            value={fields.accountPassword}
            onChange={handleFieldChange}
            fullWidth
          />
          <Box component="form" noValidate autoComplete="off" onSubmit={handleUnlockButton}>
            <Stack spacing={2} direction="row" alignItems="center">
              <TextField
                error={decryptError}
                label="Secret"
                variant="outlined"
                type="password"
                name="accountSecret"
                value={fields.accountSecret}
                onChange={handleFieldChange}
                fullWidth
              />
              <Button
                onClick={handleUnlockButton}
                variant="outlined"
                disabled={!isLocked}
              >Unlock</Button>
            </Stack>
          </Box>
          <TextField
            label="Last Changed"
            variant="outlined"
            value={dateToString(fields.lastChanged, true)}
            disabled
            fullWidth
          />
          <TextField
            label="Last Used"
            variant="outlined"
            value={dateToString(fields.lastUsed, true)}
            disabled
            fullWidth
          />
        </Stack>
        <Stack mt={2} direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSaveButton}
            disabled={isSaved}
          >Save</Button>
          <Button
            color="warning"
            variant="outlined"
            fullWidth
            onClick={e => { }}
            disabled={mode === 'NEW'}
          >Delete</Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => rrNavigate(-1)}
          >Back</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Edit;