import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

import PasswordCard from '../components/PasswordCard';
import { dateToString } from '../helpers/utilities';
import { getPasswords } from '../helpers/localstorage';

function Home() {
  const rrNavidate = useNavigate();
  const [passwords, setPasswords] = useState([]);

  const memorizedPasswords = useMemo(() => getPasswords().data, []);

  useEffect(() => {
    setPasswords(memorizedPasswords);

    return () => true
  }, [memorizedPasswords]);


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

  // console.log('Home render');

  return (
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
                handleCopyUserName={handleCopyUserName}
                handleCopyPassword={handleCopyPassword}
                handlePasswordSettings={handlePasswordSettings}
              />
            );
          })}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;