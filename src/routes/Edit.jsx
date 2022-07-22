import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { v1 as uuidv1 } from 'uuid';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
// import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { getPasswordById } from '../helpers/localstorage';
import { dateToString } from '../helpers/utilities';

const initialFieldData = {
  passwordId: uuidv1(),
  passwordTitle: '',
  accountCipher: '',
  passwordCipher: '',
  lastUsed: new Date(),
  lastChanged: new Date(),
  accountName: '**************',
  accountPassword: '**************'
};

function Edit() {
  const rrNavigate = useNavigate();
  const rrPath = useLocation().pathname;
  const { passwordId } = useParams();
  const [header, setHeader] = useState('');
  const [fields, setFields] = useState(initialFieldData);
  const [accountLock, setAccountLock] = useState(true);
  const [passwordLock, setPasswordLock] = useState(true);

  useEffect(() => {
    // console.log('Edit effect render');
    if (rrPath === '/edit/new') {
      setHeader('Create New Password');
    } else {
      if (passwordId) {
        setHeader('Edit Password');
        let password = getPasswordById(passwordId).data;
        if (password.length > 0) setFields({
          ...initialFieldData,
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
  };

  const handleAccountLock = (e) => {
    setAccountLock(!accountLock);
  };

  const handlePasswordLock = (e) => {
    setPasswordLock(!passwordLock);
  };

  // console.log('Edit render ');
  // console.log('Edit: fields...', fields);

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
            value={fields.passwordTitle}
            onChange={handleFieldChange}
            fullWidth
          />
          <Stack direction="row" spacing={2}>
            <TextField
              label="Account"
              variant="outlined"
              name="accountName"
              value={fields.accountName}
              onChange={handleFieldChange}
              fullWidth
            />
            <IconButton onClick={handleAccountLock}>{accountLock ? <LockIcon /> : <LockOpenIcon />}</IconButton>
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Password"
              variant="outlined"
              name="accountPassword"
              // type="password"
              value={fields.accountPassword}
              onChange={handleFieldChange}
              fullWidth
            />
            <IconButton onClick={handlePasswordLock}>{passwordLock ? <LockIcon /> : <LockOpenIcon />}</IconButton>
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
      </Paper>
      <Stack mt={2} direction="row" spacing={2}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => { }}
        >Save</Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => rrNavigate(-1)}
        >Back</Button>
      </Stack>
    </Container>
  );
}

export default Edit;