import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { saveLocalStorage } from '../helpers/localstorage';
import { storageItems } from '../config/defaults';
import { validateImportString } from '../helpers/utilities';

function Upload() {
  const rrNavigate = useNavigate();
  const [passwordsString, setPasswordsString] = useState('');
  const [passwordsObject, setPasswordsObject] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [isError, setIsError] = useState(false);

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

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Typography variant="h6" sx={{ mt: 2 }}>Restore My Passwords</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <TextField
          label="Password Data"
          multiline
          fullWidth
          rows={16}
          value={passwordsString}
          disabled={isValid}
          onChange={(e) => setPasswordsString(e.currentTarget.value)}
        />
        <Stack mt={2} direction="row" spacing={2}>
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