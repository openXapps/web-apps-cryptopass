// MUI components
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';

// MUI icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContentCopy from '@mui/icons-material/ContentCopy';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

export default function PasswordCard(props) {
  const isActive = props.passwordId === props.passwordIdUnlocked;
  const titleColor = isActive ? 'text.primary' : 'text.secondary';
  // const titleSize = props.smallScreen ? 'body1.fontSize' : props.passwordListIsDense ? 'h6' : '1.1rem';
  const titleSize = props.passwordListIsDense ? (props.smallScreen ? 'body1.fontSize' : 'h6') : '1.1rem';

  return (
    <Grid item xs={12} sm={12} md={props.passwordListIsDense ? 12 : 6}>
      <Card elevation={5}>
        <CardHeader
          title={props.passwordTitle}
          titleTypographyProps={{
            color: titleColor,
            fontSize: titleSize
          }}
          action={
            <>
              {isActive ? (
                <IconButton
                  onClick={props.handleLockButton}
                  data-id={props.passwordId}
                  aria-label="unlock account"
                ><LockOpenIcon /></IconButton>
              ) : (
                <IconButton
                  onClick={props.handleUnlockButton}
                  data-id={props.passwordId}
                  aria-label="lock account"
                ><LockIcon /></IconButton>
              )}
              <IconButton
                onClick={props.handlePasswordSettings}
                data-id={props.passwordId}
                aria-label="edit account"
              ><MoreVertIcon /></IconButton>
            </>
          }
        />
        {props.passwordListIsDense ? null : (
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={5}><Typography variant="body2">Last Unlocked</Typography></Grid>
              <Grid item xs={7}><Typography variant="body2" textAlign="right">{props.lastUsed}</Typography></Grid>
              <Grid item xs={5}><Typography variant="body2">Last Changed</Typography></Grid>
              <Grid item xs={7}><Typography variant="body2" textAlign="right">{props.lastChanged}</Typography></Grid>
            </Grid>
          </CardContent>
        )}
        {!isActive ? (null) : (
          <CardActions>
            <Stack
              spacing={{ xs: 1, md: 2 }}
              direction="row"
              justifyContent="space-between"
              sx={{ width: 1 }}
              mb={1}
              mx={1}
            >
              <Button
                aria-label="copy user name"
                size="small"
                fullWidth
                variant="contained"
                color={isActive ? 'warning' : 'info'}
                endIcon={props.usernameCopied ? <CheckCircleOutline /> : <ContentCopy />}
                // disabled={props.usernameCopied}
                onClick={props.handleCopyUserName}
                data-id={props.passwordId}
              >{props.usernameCopied ? 'User Name Copied' : 'Copy User Name'}</Button>
              <Button
                aria-label="copy password"
                size="small"
                fullWidth
                variant="contained"
                color={isActive ? 'warning' : 'secondary'}
                endIcon={props.passwordCopied ? <CheckCircleOutline /> : <ContentCopy />}
                // disabled={props.passwordCopied}
                onClick={props.handleCopyPassword}
                data-id={props.passwordId}
              >{props.passwordCopied ? 'Password Copied' : 'Copy Password'}</Button>
            </Stack>
          </CardActions>
        )}
      </Card>
    </Grid >
  );
}
