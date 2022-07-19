import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
// import Box from '@mui/material/Box';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
// import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';

import PasswordCard from '../components/PasswordCard';

function Home() {
  return (
    <Container maxWidth="md">
      <Toolbar disableGutters />
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <PasswordCard
          passwordTitle="Dropbox"
          lastUsed="2022-07-01 13:22"
          lastChanged="2022-05-15 07:12"
        />
        <PasswordCard
          passwordTitle="Google"
          lastUsed="2022-07-09 07:15"
          lastChanged="2021-03-12 15:01"
        />
      </Grid>
    </Container>
  );
}

export default Home;