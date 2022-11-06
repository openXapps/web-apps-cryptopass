import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
  getPasswordById,
  updatePassword,
  addPassword,
  deletePassword,
  getSettings
} from '../helpers/localstorage';
import { dateToString, decryptCipher, encryptString } from '../helpers/utilities';

const initialFieldData = {
  passwordId: '',
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
  const secretEl = useRef(null);
  const { passwordId } = useParams();
  const [mode, setMode] = useState('');
  const [header, setHeader] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fields, setFields] = useState(initialFieldData);
  const [showPassword, setShowPassword] = useState(false);
  const [decryptError, setDecryptError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    if (rrPath === '/edit/new') {
      setMode('NEW');
      setHeader('Create New Password');
      setIsUnlocked(true);
    } else {
      if (passwordId) {
        setMode('EDIT');
        setHeader('Edit Password');
        let password = getPasswordById(passwordId).data;
        if (password.length > 0) setFields({
          accountName: '*********',
          accountPassword: '************',
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
    secretEl.current.focus();
    return () => true;
  }, [rrPath, passwordId]);

  const handleFieldChange = ({ target: { name, value } }) => {
    // if (isSaved && name !== 'accountSecret') setIsSaved(false);
    if (isSaved && isUnlocked) setIsSaved(false);
    if (decryptError) setDecryptError(false);
    setFields({ ...fields, [name]: value });
  };

  const handleUnlockButton = (e) => {
    e.preventDefault();
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
    // console.log('passwordUnlockSecret...', passwordUnlockSecret);
    if (!isUnlocked) {
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
          setIsUnlocked(true);
        } else {
          // console.log('Decryption failed');
          if (!decryptError) {
            setDecryptError(true);
            setFields({ ...fields, accountSecret: '' });
            secretEl.current.focus();
          }
          if (isUnlocked) setIsUnlocked(false);
        }
      } else {
        if (!decryptError) setDecryptError(true);
        if (isUnlocked) setIsUnlocked(false);
        secretEl.current.focus();
      }
    }
  };

  const handleSaveButton = (e) => {
    let isFormValid = true
    let passwordToSave = {};

    // ToDo: form validation
    // isFormValid = validateForm(`PASSWORD_${mode}`, fields);

    if (fields.accountSecret.length > 0 && isFormValid) {
      passwordToSave = {
        passwordId: mode === 'EDIT' ? fields.passwordId : uuidv1(),
        passwordTitle: fields.passwordTitle,
        accountCipher: encryptString(fields.accountName, fields.accountSecret),
        passwordCipher: encryptString(fields.accountPassword, fields.accountSecret),
        lastUsed: new Date(),
        lastChanged: new Date(),
      };
      // console.log('passwordToSave...', passwordToSave);
      if (mode === 'EDIT') {
        updatePassword(passwordToSave.passwordId, passwordToSave);
        setIsSaved(true);
      } else {
        addPassword(passwordToSave);
        setIsSaved(true);
        setIsUnlocked(false);
        setTimeout(() => {
          rrNavigate(`/edit/${passwordToSave.passwordId}`, { replace: true });
        }, 800);
      };
    }
  };

  const deletePasswordAction = () => {
    deletePassword(passwordId);
    setFields({ ...initialFieldData, passwordId: uuidv1() });
    setIsUnlocked(true);
    setTimeout(() => {
      rrNavigate('/edit/new', { replace: true });
    }, 800);
  };

  const handleDeleteButton = (e) => {
    // ToDo: need to implement confirmation dialog
    if (mode === 'EDIT' && passwordId) {
      if (getSettings().data.confirmOnDelete) {
        setDialogOpen(true);
      } else {
        deletePasswordAction();
      }
    }
  };

  const handleDeleteYesButton = () => {
    setDialogOpen(false);
    deletePasswordAction();
  };

  return (
    <>
      <Container maxWidth="sm">
        <Toolbar />
        <Typography variant="h6" sx={{ mt: 2 }}>{header}</Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack spacing={2}>
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
                  inputRef={secretEl}
                />
                <Button
                  onClick={handleUnlockButton}
                  variant="outlined"
                  disabled={isUnlocked}
                >Unlock</Button>
              </Stack>
            </Box>
            <TextField
              label="Title"
              variant="outlined"
              name="passwordTitle"
              autoComplete="off"
              disabled={!isUnlocked}
              value={fields.passwordTitle}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              label="Account"
              variant="outlined"
              name="accountName"
              autoComplete="off"
              disabled={!isUnlocked}
              value={fields.accountName}
              onChange={handleFieldChange}
              fullWidth
            />
            <Stack spacing={2} direction="row" alignItems="center">
              <TextField
                label="Password"
                variant="outlined"
                name="accountPassword"
                type={showPassword ? 'text' : 'password'}
                // https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#the_autocomplete_attribute_and_login_fields
                autoComplete="new-password"
                disabled={!isUnlocked}
                value={fields.accountPassword}
                onChange={handleFieldChange}
                fullWidth
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                disabled={!isUnlocked}
              >{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
            </Stack>
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
              onClick={handleDeleteButton}
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title" textAlign="center">Delete Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Password record will be permanently deleted. Are you sure?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteYesButton} fullWidth variant="outlined">Yes</Button>
          <Button onClick={() => setDialogOpen(false)} fullWidth variant="outlined">No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Edit;