import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

import PasswordCard from '../components/PasswordCard';
import { userDate } from '../helpers/utilities';

function Home() {
  const rrNavidate = useNavigate();

  const handleCopyUserName = (e) => {
    console.log('handleCopyUserName: e........', e.currentTarget.dataset.id);
  };

  const handleCopyPassword = (e) => {
    console.log('handleCopyPassword: e.......', e.currentTarget.dataset.id);
  };

  const handlePasswordSettings = (e) => {
    console.log('handlePasswordSettings: e...', e.currentTarget.dataset.id);
    e.preventDefault();
    rrNavidate(`/edit/${e.currentTarget.dataset.id}`);
  }

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Box mt={2}>
        <Grid container spacing={2}>
          <PasswordCard
            passwordId="123"
            passwordTitle="Dropbox"
            lastUsed={userDate(new Date('2022-07-01 13:22'), true)}
            lastChanged={userDate(new Date('2022-05-15 07:12'), true)}
            handleCopyUserName={handleCopyUserName}
            handleCopyPassword={handleCopyPassword}
            handlePasswordSettings={handlePasswordSettings}
          />
          <PasswordCard
            passwordId="456"
            passwordTitle="Google"
            lastUsed={userDate(new Date('2022-07-09 07:15'), true)}
            lastChanged={userDate(new Date('2021-03-12 15:01'), true)}
            handleCopyUserName={handleCopyUserName}
            handleCopyPassword={handleCopyPassword}
            handlePasswordSettings={handlePasswordSettings}
          />
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;