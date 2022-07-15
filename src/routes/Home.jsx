import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

function Home() {
  return (
    <Container maxWidth="md">
      <Toolbar disableGutters />
      <Paper sx={{ mt: 2 }}>
        <Card>
          <CardHeader title="Dropbox" />
          <CardContent>
            <Typography></Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}><Typography>Last Used</Typography></Grid>
              <Grid item xs={8}><Typography>2022-07-01 13:22</Typography></Grid>
              <Grid item xs={4}><Typography>Last Changed</Typography></Grid>
              <Grid item xs={8}><Typography>2022-05-15 07:12</Typography></Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Stack spacing={2} direction="row">
              <Button>Copy Account</Button>
              <Button>Copy Password</Button>
              <Button>Edit</Button>
            </Stack>
          </CardActions>
        </Card>
      </Paper>
    </Container>
  );
}

export default Home;