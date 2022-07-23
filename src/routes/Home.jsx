import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// https://www.npmjs.com/package/crypto-js
import CryptoJs from 'crypto-js';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import PasswordCard from '../components/PasswordCard';
import { dateToString } from '../helpers/utilities';
import { getPasswords, getPasswordById } from '../helpers/localstorage';

const initialPassword = {
  passwordId: '',
  passwordTitle: '',
  accountCipher: '',
  passwordCipher: '',
  lastUsed: new Date(),
  lastChanged: new Date(),
};

function Home() {
  const rrNavidate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState(initialPassword);
  const [passwords, setPasswords] = useState([]);
  const [passwordIdToBeUnlocked, setPasswordIdToBeUnlocked] = useState('');
  const [passwordIdUnlocked, setPasswordIdUnlocked] = useState('');
  const [passwordUnlockSecret, setPasswordUnlockSecret] = useState('');
  const [account, setAccount] = useState({ username: '', password: '' });
  const [decryptError, setDecryptError] = useState(false);

  const memorizedPasswords = useMemo(() => getPasswords().data, []);

  useEffect(() => {
    setPasswords(memorizedPasswords);

    return () => true
  }, [memorizedPasswords]);

  // Manage dialog state
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleCopyUserName = (e) => {
    console.log('handleCopyUserName: e........', e.currentTarget.dataset.id);
  };

  const handleCopyPassword = (e) => {
    console.log('handleCopyPassword: e.......', e.currentTarget.dataset.id);
  };

  const handlePasswordSettings = (e) => {
    // console.log('handlePasswordSettings: e...', e.currentTarget.dataset.id);
    rrNavidate(`/edit/${e.currentTarget.dataset.id}`);
  }

  const handleUnlockButton = (e) => {
    // console.log('Home: password...', getPasswordById(e.currentTarget.dataset.id).data[0]);
    setPassword(getPasswordById(e.currentTarget.dataset.id).data[0]);
    setPasswordIdToBeUnlocked(e.currentTarget.dataset.id);
    handleDialogOpen();
  };

  const handlePasswordUnlockSecertChange = (e) => {
    setPasswordUnlockSecret(e.currentTarget.value);
  };

  const handleUnlockConfirm = (e) => {
    e.preventDefault();
    if (passwordUnlockSecret) {
      try {
        const bytesAccount = CryptoJs.AES.decrypt(password.accountCipher, passwordUnlockSecret);
        const bytesPassword = CryptoJs.AES.decrypt(password.passwordCipher, passwordUnlockSecret);
        setAccount({
          username: bytesAccount.toString(CryptoJs.enc.Utf8),
          password: bytesPassword.toString(CryptoJs.enc.Utf8)
        });
        setDecryptError(false);
        // setPasswordIdUnlocked(passwordIdToBeUnlocked);
        // handleDialogClose();
      } catch (error) {
        setDecryptError(true);
        // setPasswordIdUnlocked('');
      }
    }
  };



  // console.log('Home render');

  return (
    <div>
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

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Unlock Password</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
          >Enter your password unlock secret</DialogContentText>
          <Typography>{passwordIdToBeUnlocked}</Typography>
          <Typography>{password.accountCipher}</Typography>
          <Typography>{password.passwordCipher}</Typography>
          <Typography>{account.username}</Typography>
          <Typography>{account.password}</Typography>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleUnlockConfirm}>
            <TextField
              sx={{ mt: 2 }}
              error={decryptError}
              label="Secret"
              variant="outlined"
              type="password"
              value={passwordUnlockSecret}
              onChange={handlePasswordUnlockSecertChange}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUnlockConfirm} color="primary">Unlock</Button>
          <Button onClick={handleDialogClose} color="primary" autoFocus>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;