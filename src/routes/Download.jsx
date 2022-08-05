import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { getDownloadableData } from '../helpers/localstorage';
import { copyToClipboard } from '../helpers/utilities';

function Download() {
  const rrNavigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const passwords = getDownloadableData();

  const handleCopyButton = () => {
    copyToClipboard(passwords).finally(() => {
      setIsCopied(true);
    });
  };

  const handleSaveAsButton = () => {
    var blob = new Blob([passwords], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'CryptoPASS.json', { autoBom: false });
    setIsSaved(true);
  };

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Typography variant="h6" sx={{ mt: 2 }}>Backup My Passwords</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <TextField
          label="Password Data"
          multiline
          fullWidth
          rows={16}
          value={passwords}
          disabled
        />
        <Stack mt={2} direction="row" spacing={2}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleCopyButton}
            disabled={isCopied}
          >{isCopied ? 'Copied' : 'Copy'}</Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSaveAsButton}
            disabled={isSaved}
          >Save As</Button>
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

export default Download;