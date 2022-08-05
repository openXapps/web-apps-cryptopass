import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMediaQuery } from '@mui/material';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import LoadFileButton from '../components/LoadFileButton';
import useFileReader from '../hooks/useFileReader';
import { saveLocalStorage } from '../helpers/localstorage';
import { storageItems } from '../config/defaults';
import { validateImportString } from '../helpers/utilities';

function readerOnLoad(e) {
  // console.log(new Date());
  // console.log(e);
  // console.log(e.target.result);
  return e.currentTarget.result;
}

function Upload() {
  const rrNavigate = useNavigate();
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [spacing, setSpacing] = useState(smallScreen ? 1 : 2);
  const [{ frResult, frError, frFile, frLoading }, setFrFile] = useFileReader({frMethod: 'readAsText', rfOnload: readerOnLoad});
  const [passwordsString, setPasswordsString] = useState('');
  const [passwordsObject, setPasswordsObject] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSpacing(smallScreen ? 1 : 2);
    return () => true;
  }, [smallScreen]);

  const handleValidationButton = () => {
    const validation = validateImportString(passwordsString);
    if (validation.ok) {
      setIsValid(true);
      setIsSaved(false);
      setPasswordsObject(validation.result.passwords);
      if (isError) setIsError(false);
    } else {
      console.log('Upload: validation error...', validation.message);
      if (!isError) setIsError(true);
    }
  };

  const handleSaveButton = () => {
    saveLocalStorage(storageItems.passwords, passwordsObject);
    setIsSaved(true);
  };

  // function readerOnLoad(e) {
  //   console.log(new Date());
  //   console.log(e);
    // console.log(e.target.result);
  //   setPasswordsString(e.currentTarget.result);
  //   setIsLoading(false);
  //   e.removeEventListener();
  // }
  
  const handleLoadFileInput = (e) => {
    const reader = new FileReader()
    reader.onload = readerOnLoad;
    console.log(new Date());
    setIsLoading(true);
    reader.readAsText(e.currentTarget.files[0]);
    console.log('reader.DONE...', reader.DONE);
  };

  const handleLoadFileReset = () => {
    setPasswordsString('');
    if (isError) setIsError(false);
    if (isValid) setIsValid(false);
    if (!isSaved) setIsSaved(true);
  }

  return (
    <Container maxWidth="sm">
      <Toolbar />
      {isLoading && <LinearProgress />}
      <Typography variant="h6" sx={{ mt: spacing }}>Restore My Passwords</Typography>
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
            buttonLabel={isLoading ? 'Loading' : 'Open File'}
            isLoading={isLoading}
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