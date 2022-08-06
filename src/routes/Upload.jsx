import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import LoadFileButton from '../components/LoadFileButton';
import useFileReader from '../hooks/useFileReader';
import { saveLocalStorage } from '../helpers/localstorage';
import { storageItems } from '../config/defaults';
import { validateImportString } from '../helpers/utilities';

// function readerOnLoad(e) {
// console.log(new Date());
// console.log(e);
// console.log(e.target.result);
// return e.currentTarget.result;
// }

function Upload() {
  const rrNavigate = useNavigate();
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [spacing, setSpacing] = useState(smallScreen ? 1 : 2);
  const [{ frResult, frError, frLoading, frLoaded }, setFrFile] = useFileReader('readAsText');
  const [passwordsString, setPasswordsString] = useState('');
  const [passwordsObject, setPasswordsObject] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSpacing(smallScreen ? 1 : 2);
    return () => true;
  }, [smallScreen]);

  useEffect(() => {
    setPasswordsString(frResult);
    return () => true;
  }, [frResult]);

  const handleValidationButton = () => {
    const validation = validateImportString(passwordsString);
    if (validation.ok) {
      setIsValid(true);
      setIsSaved(false);
      setPasswordsObject(validation.result.passwords);
      if (isError) setIsError(!isError);
    } else {
      console.log('Upload: validation error...', validation.message);
      if (isError) setIsError(!isError);
    }
  };

  const handleSaveButton = () => {
    saveLocalStorage(storageItems.passwords, passwordsObject);
    setIsSaved(true);
  };

  const handleLoadFileInput = (e) => {
    setFrFile(e.currentTarget.files[0]);
  };

  const handleLoadFileReset = () => {
    setPasswordsString('');
    if (isError) setIsError(!isError);
    if (isValid) setIsValid(!isValid);
    if (!isSaved) setIsSaved(!isSaved);
  }

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Box mt={spacing} mr={spacing}>
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Restore My Passwords</Typography>
          {frLoading && <CircularProgress size={24} color="info" />}
        </Stack>
      </Box>
      <Paper sx={{ mt: spacing, p: spacing }}>
        <TextField
          sx={{ mt: 1 }}
          label="Password Data"
          multiline
          fullWidth
          rows={smallScreen ? 13 : 16}
          value={passwordsString}
          disabled={isValid}
          onChange={(e) => setPasswordsString(e.currentTarget.value)}
        />
        <Stack mt={2} direction={smallScreen ? 'column' : 'row'} spacing={spacing}>
          <LoadFileButton
            handleLoadFileInput={handleLoadFileInput}
            handleLoadFileReset={handleLoadFileReset}
            buttonLabel={frLoading ? 'Loading' : 'Open File'}
            isLoading={frLoading}
            color={frError ? 'error' : 'primary'}
            disabled={frLoaded}
          />
          <Button
            variant="outlined"
            fullWidth
            onClick={handleValidationButton}
            disabled={isValid}
            color={isError ? 'error' : 'primary'}
          >{isValid ? 'Validated' : 'Validate'}</Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSaveButton}
            disabled={isSaved}
          >{isSaved ? 'Saved' : 'Save'}</Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => rrNavigate(-1)}
          >Back</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Upload;