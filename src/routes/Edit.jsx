import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

const initialFieldData = {
  categoryId: '017cf222-887b-11e9-bc42-526af7764f64',
  passwordId: '017cf222-887b-11e9-bc42-526af7764f65',
  passwordTitle: 'Sample (use pass123 to unlock)',
  accountCipher: 'U2FsdGVkX198GbGg850GTkUP1MnEDLlwKRX7u5wQJO/KrvI0DPeSk3mWHoGBWC7u',
  passwordCipher: 'U2FsdGVkX1+safNjGmVaUpxPcZkGRZFJj92Cuo/1llrycOdNK8iWWzpptoIVvxu2',
  favourite: true,
  lastUsed: new Date(),
  lastChanged: new Date(),
};

function Edit() {
  const rrLocation = useLocation();
  const rrParams = useParams();
  const [header, setHeader] = useState();
  const [fields, setFields] = useState(initialFieldData);

  useEffect(() => {
    if (rrLocation.pathname === '/edit/new') {
      setHeader('Create New Password');
    } else {
      setHeader('Edit Password');
    }
    return () => true;
  }, [rrLocation.pathname]);

  const handleFieldChange = ({ target: { name, value } }) => {
    setFields({ ...fields, [name]: value });
  };

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Typography variant="h6" sx={{ mt: 2 }}>{header}</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            variant="outlined"
            name="passwordTitle"
            value={fields.passwordTitle}
            onChange={handleFieldChange}
            fullWidth
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" pl={1}>
            <Typography>Favourite</Typography>
            <Switch
              checked={fields.favourite}
              onChange={() => handleFieldChange({ target: { name: 'favourite', value: !fields.favourite } })}
            />
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Edit;