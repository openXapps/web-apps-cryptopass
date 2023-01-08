import { useEffect, useMemo, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PatternIcon from '@mui/icons-material/Pattern';
import PasswordIcon from '@mui/icons-material/Password';

import PasswordCard from '../components/PasswordCard';
import PatternLock from '../components/patternlock/PatternLock';

import { AppContext } from '../context/AppStore';
import { dateToString, decryptCipher, copyToClipboard } from '../helpers/utilities';
import { getPasswords, getPasswordById, updateLastClicked, getSettings } from '../helpers/localstorage';

const initialPassword = {
  passwordId: '',
  passwordTitle: '',
  accountCipher: '',
  passwordCipher: '',
  lastUsed: new Date(),
  lastChanged: new Date(),
};

const initialAccount = { username: '', password: '' };

function Home() {
  const rrNavidate = useNavigate();
  // https://stackoverflow.com/questions/59647940/how-can-i-use-ref-in-textfield
  const secretRef = useRef(null);
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const isDark = !getSettings().data.themeIsDark
  const [appState,] = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [account, setAccount] = useState(initialAccount);
  const [password, setPassword] = useState(initialPassword);
  const [passwords, setPasswords] = useState([]);
  const [passwordIdToBeUnlocked, setPasswordIdToBeUnlocked] = useState('');
  const [passwordIdUnlocked, setPasswordIdUnlocked] = useState('');
  const [passwordUnlockSecret, setPasswordUnlockSecret] = useState('');
  const [decryptError, setDecryptError] = useState(false);
  const [isPatternMode, setIsPatternMode] = useState(false);
  const [patternPath, setPatternPath] = useState([]);
  // const [patternSuccess, setPatternSuccess] = useState(false);
  const [patternError, setPatternError] = useState(false);

  // Create a memorized password list
  const memorizedPasswords = useMemo(() => {
    return (
      appState.searchString.length > 2 ? (
        getPasswords(appState.searchString).data
      ) : (getPasswords().data)
    );
  }, [appState.searchString]);

  // Manage passwords state
  useEffect(() => {
    setPasswords(memorizedPasswords);
    return () => true
  }, [memorizedPasswords]);

  const handlePasswordSettings = (e) => {
    rrNavidate(`/edit/${e.currentTarget.dataset.id}`);
  }

  const handleCopyUserName = () => {
    // console.log('handleCopyUserName: username........', account.username);
    copyToClipboard(account.username);
  };

  const handleCopyPassword = () => {
    // console.log('handleCopyPassword: password........', account.password);
    copyToClipboard(account.password);
  };

  const handleLockButton = () => {
    setPassword(initialPassword);
    setAccount(initialAccount);
    setPasswordIdUnlocked('');
    setPasswordIdToBeUnlocked('');
  };

  const handleUnlockButton = (e) => {
    setPassword(getPasswordById(e.currentTarget.dataset.id).data[0]);
    setPasswordIdToBeUnlocked(e.currentTarget.dataset.id);
    setAccount(initialAccount);
    handleDialogOpen();
  };


  /*
   * DIALOG handlers starts
   ***********************************************************************************/

  const handleDialogOpen = () => {
    setDialogOpen(true);
    // Wait for dialog component to render
    // else secretRef is undefined
    // Since adding the pattern option
    // useRef doesn't work as expected.
    // if (secretRef.current) {
    //   setTimeout(() => {
    //     secretRef.current.focus();
    //   }, 500);
    // }
  };

  const handleDialogClose = () => {
    setDecryptError(false);
    setPatternPath([]);
    setPasswordUnlockSecret('');
    setDialogOpen(false);
  };

  const handlePatternButton = () => {
    if (isPatternMode) {
      setPatternPath([]);
      setPasswordUnlockSecret('');
    }
    setIsPatternMode(!isPatternMode);
  };

  const handlePatternFinish = () => {
    if (doUnlockAction(patternPath.join('-'))) {
      handleDialogClose();
    } else {
      setPatternError(true);
      setTimeout(() => {
        setPatternError(false);
        setPatternPath([]);
      }, 500);
    }
  };

  const handleUnlockFormSubmit = (e) => {
    e.preventDefault();
    if (doUnlockAction(passwordUnlockSecret)) {
      handleDialogClose();
    } else {
      setDecryptError(true);
      setPasswordUnlockSecret('');
      if (secretRef.current) secretRef.current.focus();
    }
  };

  const doUnlockAction = (secret) => {
    let result = false;
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
    // console.log('secret...', secret);
    if (secret.length > 0) {
      _username = decryptCipher(password.accountCipher, secret);
      _password = decryptCipher(password.passwordCipher, secret);
      // console.log('_username...', _username);
      // console.log('_password...', _password);
      if (_username.ok && _password.ok) {
        // console.log('Decryption good');
        setAccount({
          username: _username.value,
          password: _password.value
        });
        setPasswordIdUnlocked(passwordIdToBeUnlocked);
        updateLastClicked(password.passwordId);
        result = true;
      }
    }
    return result;
  }

  /************************************************************************************
   * DIALOG handlers ends
   */

  return (
    <>
      <Container maxWidth="md">
        <Toolbar />
        <Box mt={2}>
          <Grid container spacing={2}>
            {passwords.map(v => {
              return (
                <PasswordCard
                  key={v.passwordId}
                  passwordId={v.passwordId}
                  passwordTitle={v.passwordTitle}
                  lastUsed={dateToString(v.lastUsed, true)}
                  lastChanged={dateToString(v.lastChanged, true)}
                  smallScreen={smallScreen}
                  passwordIdUnlocked={passwordIdUnlocked}
                  passwordListIsDense={getSettings().data.passwordListIsDense}
                  handleCopyUserName={handleCopyUserName}
                  handleCopyPassword={handleCopyPassword}
                  handlePasswordSettings={handlePasswordSettings}
                  handleUnlockButton={handleUnlockButton}
                  handleLockButton={handleLockButton}
                />
              );
            })}
          </Grid>
        </Box>
      </Container>

      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title" textAlign="center">Unlock Password</DialogTitle>
        <DialogContent>
          {isPatternMode ? (
            <PatternLock
              isDark={isDark}
              width={250}
              pointSize={30}
              size={3}
              path={patternPath}
              connectorThickness={5}
              disabled={false}
              success={false}
              error={patternError}
              onChange={(pattern) => {
                setPatternPath(pattern);
              }}
              onFinish={handlePatternFinish}
            />
          ) : (
            <Box component="form" noValidate onSubmit={handleUnlockFormSubmit}>
              <TextField
                inputRef={secretRef}
                sx={{ mt: 2 }}
                error={decryptError}
                label="Secret"
                variant="outlined"
                type="password"
                autoComplete="new-password"
                value={passwordUnlockSecret}
                onChange={e => setPasswordUnlockSecret(e.currentTarget.value)}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} fullWidth variant="outlined">Close</Button>
          <IconButton onClick={handlePatternButton}>{isPatternMode ? <PasswordIcon /> : <PatternIcon />}</IconButton>
          <Button onClick={handleUnlockFormSubmit} fullWidth variant="outlined" disabled={isPatternMode}>Unlock</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;