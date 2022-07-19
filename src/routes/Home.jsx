import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

import PasswordCard from '../components/PasswordCard';
import { userDate } from '../helpers/utilities';

function Home() {

  const handleCopyAccount = (e) => {
    console.log('handleCopyAccount: e........', e);
  };

  const handleCopyPassword = (e) => {
    console.log('handleCopyPassword: e.......', e);
  };

  const handlePasswordSettings = (e) => {
    console.log('handlePasswordSettings: e...', e.target);
  }

  return (
    <Container maxWidth="md">
      <Toolbar />
      <Box mt={2}>
        <Grid container spacing={2}>
          <PasswordCard
            passwordTitle="Dropbox"
            lastUsed={userDate(new Date('2022-07-01 13:22'), true)}
            lastChanged={userDate(new Date('2022-05-15 07:12'), true)}
            handleCopyAccount={handleCopyAccount}
            handleCopyPassword={handleCopyPassword}
            handlePasswordSettings={handlePasswordSettings}
          />
          <PasswordCard
            passwordTitle="Google"
            lastUsed={userDate(new Date('2022-07-09 07:15'), true)}
            lastChanged={userDate(new Date('2021-03-12 15:01'), true)}
          />
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;