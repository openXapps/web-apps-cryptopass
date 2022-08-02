import { useEffect, useMemo, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import PasswordCard from '../components/PasswordCard';
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
  const secretEl = useRef(null);
  const [appState,] = useContext(AppContext);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [account, setAccount] = useState(initialAccount);
  const [password, setPassword] = useState(initialPassword);
  const [passwords, setPasswords] = useState([]);
  const [passwordIdToBeUnlocked, setPasswordIdToBeUnlocked] = useState('');
  const [passwordIdUnlocked, setPasswordIdUnlocked] = useState('');
  const [passwordUnlockSecret, setPasswordUnlockSecret] = useState('');
  const [decryptError, setDecryptError] = useState(false);

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

  // Manage dialog state
  const handleDialogOpen = () => {
    setDialogOpen(true);
    // Wait for dialog component to render
    // else secretEl is undefined
    setTimeout(() => {
      secretEl.current.focus();
    }, 500);
  };

  // Manage dialog state
  const handleDialogClose = () => {
    setDecryptError(false);
    setPasswordUnlockSecret('');
    setDialogOpen(false);
  };

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

  const handleUnlockButton = (e) => {
    setPassword(getPasswordById(e.currentTarget.dataset.id).data[0]);
    setPasswordIdToBeUnlocked(e.currentTarget.dataset.id);
    setAccount(initialAccount);
    handleDialogOpen();
  };

  const handleUnlockConfirm = (e) => {
    e.preventDefault();
    let _username = { ok: false, message: '', value: '' };
    let _password = { ok: false, message: '', value: '' };
    // console.log('passwordUnlockSecret...', passwordUnlockSecret);
    if (passwordUnlockSecret.length > 0) {
      _username = decryptCipher(password.accountCipher, passwordUnlockSecret);
      _password = decryptCipher(password.passwordCipher, passwordUnlockSecret);
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
        handleDialogClose();
      } else {
        // console.log('Decryption failed');
        setDecryptError(true);
      }
    } else {
      // console.log('Invalid secret');
      setDecryptError(true);
    }
  };

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
                  passwordIdUnlocked={passwordIdUnlocked}
                  passwordListIsDense={getSettings().data.passwordListIsDense}
                  handleCopyUserName={handleCopyUserName}
                  handleCopyPassword={handleCopyPassword}
                  handlePasswordSettings={handlePasswordSettings}
                  handleUnlockButton={handleUnlockButton}
                />
              );
            })}
          </Grid>
        </Box>
      </Container>

      <Dialog open={dialogOpen} onClose={handleDialogClose} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title" textAlign="center">Unlock Password</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleUnlockConfirm}>
            <TextField
              inputRef={secretEl}
              sx={{ mt: 2 }}
              error={decryptError}
              label="Secret"
              variant="outlined"
              type="password"
              value={passwordUnlockSecret}
              onChange={e => setPasswordUnlockSecret(e.currentTarget.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUnlockConfirm} fullWidth variant="outlined">Unlock</Button>
          <Button onClick={handleDialogClose} fullWidth variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Home;