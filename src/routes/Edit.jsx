import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';
import { generate } from 'generate-password-browser';

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PatternIcon from '@mui/icons-material/Pattern';
import KeyIcon from '@mui/icons-material/Key';

import PatternLock from '../components/patternlock/PatternLock';

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
  const isDark = !getSettings().data.themeIsDark
  const { passwordId } = useParams();
  const [editMode, setEditMode] = useState('');
  // const [unlockMode, setUnlockMode] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [patternPath, setPatternPath] = useState([]);
  const [patternSuccess, setPatternSuccess] = useState(false);
  const [patternError, setPatternError] = useState(false);
  const [header, setHeader] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fields, setFields] = useState(initialFieldData);
  const [showPassword, setShowPassword] = useState(false);
  const [decryptError, setDecryptError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const passwordLength = getSettings().data.passwordLengthMarker;
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));

  //   console.log(`
  // editMode        ${editMode}
  // patternPath     ${patternPath}
  // patternSuccess  ${patternSuccess}
  // patternError    ${patternError}
  // decryptError    ${decryptError}
  // isUnlocked      ${isUnlocked}
  // isSaved         ${isSaved}
  // dialogMode      ${dialogMode}
  // dialogOpen      ${dialogOpen}
  // accountSecret   ${fields.accountSecret}
  //   `);

  useEffect(() => {
    if (rrPath === '/edit/new') {
      setEditMode('NEW');
      setHeader('Create New Password');
      setIsUnlocked(true);
    } else {
      if (passwordId) {
        setEditMode('EDIT');
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
    // console.log('handleFieldChange: name...', name);
    // if (isSaved && name !== 'accountSecret') setIsSaved(false);
    // if (name === 'accountSecret' && unlockMode !== 'SECRET') setUnlockMode('SECRET');
    if (isSaved && isUnlocked) setIsSaved(false);
    if (decryptError) setDecryptError(false);
    setFields({ ...fields, [name]: value });
  };

  /************************************************************************************
   * BUTTON HANDLER helpers
   */
  const handlePatternButton = () => {
    // if (unlockMode !== 'PATTERN') setUnlockMode('PATTREN');
    if (patternPath.length > 0) setPatternPath([]);
    if (patternError) setPatternError(false);
    if (patternSuccess) setPatternSuccess(false);
    if (decryptError) setDecryptError(false);

    if (isUnlocked) {
      if (dialogMode !== 'PATTERN_SET') setDialogMode('PATTERN_SET');
    }
    if (editMode === 'EDIT' && !isUnlocked) {
      if (dialogMode !== 'PATTERN_UNLOCK') setDialogMode('PATTERN_UNLOCK');
    }

    setDialogOpen(true);
  };

  const handlePatternSaveButton = () => {
    if (patternPath.length > 0) {
      setDialogOpen(false);
      setFields({ ...fields, accountSecret: patternPath.join('-') });
      setIsSaved(false);
    }
  };

  const handleUnlockButton = (e) => {
    // Form button, need to block defaults
    e.preventDefault();
    if (!isUnlocked) {
      if (fields.accountSecret.length > 0) {
        decryptPasswordAction(fields.accountSecret);
      } else {
        secretEl.current.focus();
      }
    }
  };

  const handleKeyButton = () => {
    if (!showPassword) setShowPassword(true);
    if (isSaved) setIsSaved(false);
    if (decryptError) setDecryptError(false);
    setFields({
      ...fields,
      accountPassword: generate({
        length: passwordLength,
        numbers: true,
        symbols: false
      })
    });
  };

  const handleSaveButton = () => {
    let isFormValid = true
    let passwordToSave = {};

    // ToDo: form validation
    // isFormValid = validateForm(`PASSWORD_${editMode}`, fields);
    console.log('handleSaveButton: accountSecret...', fields.accountSecret);

    if (fields.accountSecret.length > 0 && isFormValid) {
      passwordToSave = {
        passwordId: editMode === 'EDIT' ? fields.passwordId : uuidv1(),
        passwordTitle: fields.passwordTitle,
        accountCipher: encryptString(fields.accountName, fields.accountSecret),
        passwordCipher: encryptString(fields.accountPassword, fields.accountSecret),
        lastUsed: new Date(),
        lastChanged: new Date(),
      };
      if (editMode === 'EDIT') {
        updatePassword(passwordToSave.passwordId, passwordToSave);
        setFields({ ...fields, accountSecret: '' });
        setIsSaved(true);
        setIsUnlocked(false);
      } else {
        addPassword(passwordToSave);
        rrNavigate(-1);
        // Redirect to edit mode
        // setTimeout(() => {
        //   rrNavigate(`/edit/${passwordToSave.passwordId}`, { replace: true });
        // }, 800);
      };
    }
  };

  const handleDeleteButton = (e) => {
    if (editMode === 'EDIT' && passwordId) {
      if (getSettings().data.confirmOnDelete) {
        setDialogMode('DELETE');
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
  /*
   * BUTTON HANDLER helpers
   ***********************************************************************************/


  /************************************************************************************
   * ACTION helpers
   */
  const decryptPasswordAction = (secret = '') => {
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
    console.log('decryptPasswordAction: secret...', secret);
    if (secret.length > 0) {
      _username = decryptCipher(fields.accountCipher, secret);
      _password = decryptCipher(fields.passwordCipher, secret);
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
        if (decryptError) setDecryptError(false);
        setIsUnlocked(true);
      } else {
        // console.log('Decryption failed');
        if (!decryptError) setDecryptError(true);
        if (isUnlocked) setIsUnlocked(false);
        setFields({ ...fields, accountSecret: '' });
        secretEl.current.focus();
      }
    } else {
      if (!decryptError) setDecryptError(true);
      if (isUnlocked) setIsUnlocked(false);
      secretEl.current.focus();
    }
  };

  const patternFinishAction = () => {
    console.log('patternFinishAction: patternPath...', patternPath);
    if (patternPath.length > 0) {
      const pattern = patternPath.join('-');
      setFields({ ...fields, accountSecret: pattern });
      setDialogOpen(false);
      decryptPasswordAction(pattern);
    }
  };

  const deletePasswordAction = () => {
    deletePassword(passwordId);
    rrNavigate(-1);
    // setFields({ ...initialFieldData, passwordId: uuidv1() });
    // if (!isUnlocked) setIsUnlocked(true);
    // if (!isSaved) setIsSaved(true);
    // setTimeout(() => {
    //   rrNavigate('/edit/new', { replace: true });
    // }, 800);
  };
  /*
   * ACTION helpers
   ***********************************************************************************/

  return (
    <>
      <Container maxWidth="sm">
        <Toolbar />
        <Typography variant="h6" sx={{ mt: 2 }}>{header}</Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack spacing={2}>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleUnlockButton}>
              <Stack spacing={smallScreen ? 1 : 2} direction="row" alignItems="center">
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
                <IconButton
                  color={patternSuccess ? 'success' : 'primary'}
                  variant="outlined"
                  onClick={handlePatternButton}
                ><PatternIcon /></IconButton>
                <Divider orientation="vertical" flexItem />
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
              <IconButton
                onClick={handleKeyButton}
                disabled={!isUnlocked}
              ><KeyIcon /></IconButton>
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
              disabled={editMode === 'NEW'}
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
        {dialogMode === 'DELETE' && (
          <>
            <DialogTitle id="alert-dialog-title" textAlign="center">Delete Confirmation</DialogTitle>
            <DialogContent>
              <Typography>Password record will be permanently deleted. Are you sure?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteYesButton} fullWidth variant="outlined">Yes</Button>
              <Button onClick={() => setDialogOpen(false)} fullWidth variant="outlined">No</Button>
            </DialogActions>
          </>
        )}
        {dialogMode === 'PATTERN_SET' && (
          <>
            <DialogTitle id="alert-dialog-title" textAlign="center">Create a Pattern Lock</DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', color: 'warning.main' }}>
                <Typography variant="caption">!! Pattern lock is less secure !!</Typography>
              </Box>
              <PatternLock
                isDark={isDark}
                width={250}
                pointSize={20}
                size={3}
                path={patternPath}
                connectorThickness={5}
                disabled={false}
                success={patternSuccess}
                error={patternError}
                onChange={(pattern) => {
                  setPatternPath(pattern);
                }}
                onFinish={() => { }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} fullWidth variant="outlined">Cancel</Button>
              <Button onClick={() => patternPath.length > 0 && setPatternPath([])} fullWidth variant="outlined">Reset</Button>
              <Button onClick={handlePatternSaveButton} fullWidth variant="outlined">Save</Button>
            </DialogActions>
          </>
        )}
        {dialogMode === 'PATTERN_UNLOCK' && (
          <>
            <DialogTitle id="alert-dialog-title" textAlign="center">Unlock with Pattern</DialogTitle>
            <DialogContent>
              <PatternLock
                isDark={isDark}
                width={250}
                pointSize={20}
                size={3}
                path={patternPath}
                connectorThickness={5}
                disabled={false}
                success={patternSuccess}
                error={patternError}
                onChange={(pattern) => {
                  setPatternPath(pattern);
                }}
                onFinish={patternFinishAction}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} fullWidth variant="outlined">Cancel</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

export default Edit;