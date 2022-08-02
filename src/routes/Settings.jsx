import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Toolbar from '@mui/material/Toolbar';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

import { AppContext } from '../context/AppStore';
import { saveLocalStorage, getSettings } from '../helpers/localstorage';
import { storageItems, passwordLengthMarkers } from '../config/defaults';

const Settings = () => {
  const rrNavigate = useNavigate();
  const [state, dispatch] = useContext(AppContext);
  const settings = getSettings().data;
  const [_dencifyPasswordList, setDencifyPasswordList] = useState(settings.passwordListIsDense);
  const [_confirmOnDelete, setConfirmOnDelete] = useState(settings.confirmOnDelete);

  // Managed by state and persistence
  const handleTheme = () => {
    const _isDark = !state.themeIsDark;
    saveLocalStorage(storageItems.settings, { ...settings, themeIsDark: _isDark });
    dispatch({ type: 'THEME', payload: _isDark });
  };

  const handleDencifyPasswordList = () => {
    saveLocalStorage(storageItems.settings, { ...settings, passwordListIsDense: !_dencifyPasswordList });
    setDencifyPasswordList(!_dencifyPasswordList);
  };

  // Managed by persistence only
  const handleConfirmOnDelete = () => {
    saveLocalStorage(storageItems.settings, { ...settings, confirmOnDelete: !_confirmOnDelete });
    setConfirmOnDelete(!_confirmOnDelete);
  };

  const handlePasswordLengthMarker = (event, value) => {
    saveLocalStorage(storageItems.settings, { ...settings, passwordLengthMarker: value });
  };

  return (
    <Container maxWidth="sm">
      <Toolbar />
      <Typography variant="h6" sx={{ mt: 2 }}>Application settings</Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography>Dark Mode</Typography>
          <Switch checked={state.themeIsDark} onChange={handleTheme} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography>Densify Password List</Typography>
          <Switch checked={_dencifyPasswordList} onChange={handleDencifyPasswordList} />
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography>Confirm On Delete</Typography>
          <Switch checked={_confirmOnDelete} onChange={handleConfirmOnDelete} />
        </Stack>
        <Typography sx={{ mt: 2, color: 'warning.main' }}>Options below is for future use!</Typography>
        <Stack spacing={2} direction="row" alignItems="center" pr={1} my={2} mr={2}>
          <Typography sx={{ mr: 3 }}>Password Length</Typography>
          <Slider
            defaultValue={settings.passwordLengthMarker}
            step={5}
            marks={passwordLengthMarkers}
            min={passwordLengthMarkers[0].value}
            max={passwordLengthMarkers[passwordLengthMarkers.length - 1].value}
            onChangeCommitted={handlePasswordLengthMarker}
          />
        </Stack>
        <Button
          sx={{ mt: 2 }}
          variant="outlined"
          fullWidth
          onClick={() => rrNavigate(-1)}
        >Back</Button>
      </Paper>
    </Container>
  );
};

export default Settings;