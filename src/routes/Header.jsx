import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SearchField from '../components/SearchField';
import { AppContext } from '../context/AppStore';
import { getSettings } from '../helpers/localstorage';
import { appName } from '../config/defaults';

function Header() {
  const rrNavigate = useNavigate();
  const { pathname } = useLocation();
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [appState, appDispatch] = useContext(AppContext);

  // Cannot use dispatch outside effect while component renders
  useEffect(() => {
    if (pathname === '/' && appState.routePath !== appName) {
      appDispatch({ type: 'ROUTE', payload: appName });
    }

    return () => true;
  }, [pathname, appDispatch, appState.routePath])

  const handleMenuToggle = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRoute = (e) => {
    handleMenuClose();
    rrNavigate(`/${e.currentTarget.dataset.name}`);
  };

  const handleSeachFieldChange = (e) => {
    // setSearchField(e.currentTarget.value);
    appDispatch({ type: 'SEARCH', payload: e.currentTarget.value });
  };

  return (
    <AppBar color="inherit">
      <Container maxWidth="md" disableGutters>
        <Toolbar >
          {pathname !== '/' && (
            <Box mr={1}>
              <IconButton
                aria-label="home button"
                color="inherit"
                onClick={() => rrNavigate('/', { replace: true })}
              >{pathname === '/' ? null : <ArrowBackIcon />}</IconButton>
            </Box>
          )}
          <Typography
            sx={{ flexGrow: 1 }}
            variant="h6"
          >{appState.routePath} {!smallScreen && pathname === '/' && (
            <span style={{ fontSize: 12 }}>v{getSettings().data.version}</span>
          )}
          </Typography>
          {pathname === '/' ? (
            <Box display="flex" flexDirection="row">
              {!smallScreen && (
                <SearchField
                  searchFieldValue={appState.searchString}
                  handleSeachFieldChange={handleSeachFieldChange}
                />
              )}
              <IconButton
                color="inherit"
                onClick={() => { rrNavigate('/edit/new') }}
                aria-label="navigate to new account"
              ><AddCircleIcon /></IconButton>
              <IconButton
                color="inherit"
                onClick={() => { rrNavigate('/settings') }}
                aria-label="navigate to settings"
              ><SettingsIcon /></IconButton>
              <IconButton
                color="inherit"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                aria-label="menu options"
                onClick={handleMenuToggle}
              ><MenuIcon /></IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                transformOrigin={{ vertical: 'top', horizontal: 'right', }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleRoute} data-name='settings' aria-label="navigate to settings">Settings</MenuItem>
                <MenuItem onClick={handleRoute} data-name='download' aria-label="navigate to data backup">Backup Passwords</MenuItem>
                <MenuItem onClick={handleRoute} data-name='upload' aria-label="navigate to data restore">Restore Passwords</MenuItem>
              </Menu>
            </Box>
          ) : (null)}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;