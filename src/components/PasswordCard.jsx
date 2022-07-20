import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import SettingsIcon from '@mui/icons-material/Settings';

function PasswordCard(props) {
  return (
    <Grid item xs={12} sm={6}>
      <Card elevation={5}>
        <CardHeader
          title={props.passwordTitle}
          action={
            <IconButton
              onClick={props.handlePasswordSettings}
              data-id={props.passwordId}
            ><SettingsIcon /></IconButton>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={5}><Typography>Last Used</Typography></Grid>
            <Grid item xs={7}><Typography textAlign="right">{props.lastUsed}</Typography></Grid>
            <Grid item xs={5}><Typography>Last Changed</Typography></Grid>
            <Grid item xs={7}><Typography textAlign="right">{props.lastChanged}</Typography></Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Stack
            spacing={{ xs: 1, md: 2 }}
            direction="row"
            justifyContent="space-between"
            sx={{ width: 1 }}
          >
            <Button
              size="small"
              fullWidth
              variant="outlined"
              onClick={props.handleCopyUserName}
              data-id={props.passwordId}
            >Copy User Name</Button>
            <Button
              size="small"
              fullWidth
              variant="outlined"
              onClick={props.handleCopyPassword}
              data-id={props.passwordId}
            >Copy Password</Button>
          </Stack>
        </CardActions>
      </Card>
    </Grid>
  );
}

export default PasswordCard;