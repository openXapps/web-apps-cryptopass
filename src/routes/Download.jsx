import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

import { useMediaQuery } from '@mui/material';
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
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [spacing, setSpacing] = useState(smallScreen ? 1 : 2);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const passwords = getDownloadableData();

  useEffect(() => {
    setSpacing(smallScreen ? 1 : 2);
    return () => true;
  }, [smallScreen]);

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
      <Typography variant="h6" sx={{ mt: spacing }}>Backup My Passwords</Typography>
      <Paper sx={{ mt: spacing, p: spacing }}>
        <TextField
          sx={{mt: 1}}
          label="Password Data"
          multiline
          fullWidth
          rows={16}
          value={passwords}
          disabled
        />
        <Stack mt={spacing} direction="row" spacing={spacing}>
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