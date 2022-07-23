import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import PasswordCard from '../components/PasswordCard';
import { dateToString } from '../helpers/utilities';
import { getPasswords } from '../helpers/localstorage';

function Home() {
  const rrNavidate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [passwordIdToBeUnlocked, setPasswordIdToBeUnlocked] = useState('');
  const [passwordIdUnlocked, setPasswordIdUnlocked] = useState('');
  const [passwordUnlockSecret, setPasswordUnlockSecret] = useState('');

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
    setPasswordIdToBeUnlocked(e.currentTarget.dataset.id);
    handleDialogOpen();
  };

  const handlePasswordUnlockSecertChange = (e) => {

  };

  const handleUnlockConfirm = () => {
    setPasswordIdUnlocked(passwordIdToBeUnlocked);
    handleDialogClose();
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