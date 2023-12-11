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
};

function Edit() {
  const rrNavigate = useNavigate();
  const rrPath = useLocation().pathname;
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const secretRef = useRef(null);
  const passwordLength = getSettings().data.passwordLengthMarker;
  const isDark = !getSettings().data.themeIsDark
  const { passwordId } = useParams();

  // Component state
  const [routeHeader, setRouteHeader] = useState('');
  const [editMode, setEditMode] = useState('');
  const [fields, setFields] = useState(initialFieldData);
  const [secret, setSecret] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [decryptError, setDecryptError] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [isSaved, setIsSaved] = useState(true);
  const [patternPath, setPatternPath] = useState([]);

  useEffect(() => {
    if (rrPath === '/edit/new') {
      setEditMode('NEW');
      setRouteHeader('Create New Password');
      setIsLocked(false);
      secretRef.current.focus();
    }
    if (rrPath !== '/edit/new' && passwordId) {
      setEditMode('EDIT');
      setRouteHeader('Edit Password');
      let password = getPasswordById(passwordId).data;
      if (password.length > 0) setFields({
        accountName: '*********',
        accountPassword: '************',
        passwordId: passwordId,
        passwordTitle: password[0].passwordTitle,
        accountCipher: password[0].accountCipher,
        passwordCipher: password[0].passwordCipher,
        lastUsed: password[0].lastUsed,
        lastChanged: password[0].lastChanged,
      });
      secretRef.current.focus();
    }

    return () => true;
  }, [rrPath, passwordId]);

  /************************************************************************************
   * FIELD CHANGE handlers
   */
  const handleFieldChange = ({ target: { name, value } }) => {
    if (isSaved && !isLocked) setIsSaved(false);
    setFields(prevState => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSecretChange = (e) => {
    if (isSaved && !isLocked) setIsSaved(false);
    if (decryptError) setDecryptError(false);
    setSecret(e.target.value);
  };
  /*
   * FIELD CHANGE handlers
   ***********************************************************************************/

  /************************************************************************************
   * BUTTON handlers
   */
  const handlePatternButton = () => {
    if (patternPath.length > 0) setPatternPath([]);
    if (decryptError) setDecryptError(false);

    if (!isLocked) {
      if (dialogMode !== 'PATTERN_SET') setDialogMode('PATTERN_SET');
    }
    if (editMode === 'EDIT' && isLocked) {
      if (dialogMode !== 'PATTERN_UNLOCK') setDialogMode('PATTERN_UNLOCK');
    }

    setDialogOpen(true);
  };

  const handlePatternSaveButton = () => {
    if (patternPath.length > 0) {
      setDialogOpen(false);
      setSecret(patternPath.join('-'));
      setIsSaved(false);
    }
  };

  const handleUnlockButton = (e) => {
    // Form button, need to block defaults
    e.preventDefault();
    if (isLocked) {
      if (secret.length > 0) decryptPasswordAction(secret);
    }
  };

  const handleKeyButton = () => {
    if (!showPassword) setShowPassword(true);
    if (isSaved) setIsSaved(false);
    if (decryptError) setDecryptError(false);
    setFields(prevState => {
      return {
        ...prevState,
        accountPassword: generate({
          length: passwordLength,
          numbers: true,
          symbols: false
        })
      };
    });
  };

  const handleSaveButton = () => {
    let isFormValid = true
    let passwordToSave = {};

    // TODO: form validation
    // isFormValid = validateForm(`PASSWORD_${editMode}`, fields);

    if (secret.length > 0 && isFormValid) {
      passwordToSave = {
        passwordId: editMode === 'EDIT' ? fields.passwordId : uuidv1(),
        passwordTitle: fields.passwordTitle,
        accountCipher: encryptString(fields.accountName, secret),
        passwordCipher: encryptString(fields.accountPassword, secret),
        lastUsed: fields.lastUsed,
        lastChanged: new Date(),
      };
      if (editMode === 'EDIT') {
        updatePassword(passwordToSave.passwordId, passwordToSave);
        setFields(prevState => {
          return {
            ...prevState,
            accountCipher: passwordToSave.accountCipher,
            passwordCipher: passwordToSave.passwordCipher
          }
        });
        setSecret('');
        setIsSaved(true);
        setIsLocked(true);
        if (showPassword) setShowPassword(false);
      } else {
        addPassword(passwordToSave);
        rrNavigate(-1);
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
   * BUTTON handlers
   ***********************************************************************************/

  /************************************************************************************
   * ACTION helpers
   */
  const decryptPasswordAction = (secret = '') => {
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
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
        setIsLocked(false);
      } else {
        // console.log('Decryption failed');
        if (!decryptError) setDecryptError(true);
        if (!isLocked) setIsLocked(true);
        setSecret('');
        secretRef.current.focus();
      }
    } else {
      if (!decryptError) setDecryptError(true);
      if (!isLocked) setIsLocked(true);
      secretRef.current.focus();
    }
  };

  const patternFinishAction = () => {
    // console.log('patternFinishAction: patternPath...', patternPath);
    if (patternPath.length > 0) {
      const pattern = patternPath.join('-');
      setSecret(pattern);
      setDialogOpen(false);
      decryptPasswordAction(pattern);
    }
  };

  const deletePasswordAction = () => {
    deletePassword(passwordId);
    rrNavigate(-1);
  };
  /*
   * ACTION helpers
   ***********************************************************************************/

  return (
    <>
      <Container maxWidth="sm">
        <Toolbar />
        <Typography variant="h6" sx={{ mt: 2 }}>{routeHeader}</Typography>
        <Paper sx={{ mt: 2, p: 2 }}>
          <Stack spacing={2}>
            <Box component="form" noValidate onSubmit={handleUnlockButton}>
              <Stack spacing={smallScreen ? 1 : 2} direction="row" alignItems="center">
                <TextField
                  fullWidth
                  label="Secret"
                  variant="outlined"
                  type="password"
                  autoComplete="new-password"
                  inputRef={secretRef}
                  value={secret}
                  error={decryptError}
                  onChange={handleSecretChange}
                />
                <IconButton
                  // color={patternSuccess ? 'success' : 'primary'}
                  variant="outlined"
                  onClick={handlePatternButton}
                ><PatternIcon /></IconButton>
                <Divider orientation="vertical" flexItem />
                <Button
                  onClick={handleUnlockButton}
                  variant="outlined"
                  disabled={!isLocked}
                >Unlock</Button>
              </Stack>
            </Box>
            <TextField
              label="Title"
              variant="outlined"
              name="passwordTitle"
              autoComplete="off"
              disabled={isLocked}
              value={fields.passwordTitle}
              onChange={handleFieldChange}
              fullWidth
            />
            <TextField
              label="Account"
              variant="outlined"
              name="accountName"
              autoComplete="off"
              disabled={isLocked}
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
                disabled={isLocked}
                value={fields.accountPassword}
                onChange={handleFieldChange}
                fullWidth
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked}
              >{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
              <IconButton
                onClick={handleKeyButton}
                disabled={isLocked}
              ><KeyIcon /></IconButton>
            </Stack>
            <TextField
              label="Last Changed"
              variant="outlined"
              value={dateToString(fields.lastChanged, true, 'R')}
              disabled
              fullWidth
            />
            <TextField
              label="Last Used"
              variant="outlined"
              value={dateToString(fields.lastUsed, true, 'R')}
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
                pointSize={30}
                size={3}
                path={patternPath}
                connectorThickness={5}
                disabled={false}
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
                pointSize={30}
                size={3}
                path={patternPath}
                connectorThickness={5}
                disabled={false}
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