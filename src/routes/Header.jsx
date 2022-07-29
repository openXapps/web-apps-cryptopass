import { useState, useContext, useEffect, useDeferredValue } from 'react';
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
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import SearchField from '../components/SearchField';
import { AppContext } from '../context/AppStore';
// import AppContextReducer from '../context/AppReducer';
import { getSettings } from '../helpers/localstorage';

function Header() {
  const rrNavigate = useNavigate();
  const rrLocation = useLocation();
  const smallScreen = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [appState, appDispatch] = useContext(AppContext);
  // const [searchField, setSearchField] = useState(appState.searchField);
  // const searchFieldDeferred = useDeferredValue(appState.searchString);

  // console.log('Header: appState...', appState);

  // useEffect(() => {
  //   appDispatch({ type: 'SEARCH', payload: searchFieldDeferred });

  //   return () => true;
  // }, [searchFieldDeferred, appDispatch]);

  const handleHomeButton = () => {
    if (rrLocation.pathname !== '/') {
      rrNavigate('/', { replace: true });
    } else {
      window.location.assign('https://www.openapps.co.za');
    }
  };

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
        <Toolbar disableGutters>
          <Box mr={1}>
            <IconButton
              aria-label="home button"
              color="inherit"
              onClick={handleHomeButton}
            >{rrLocation.pathname === '/' ? <HomeIcon /> : <ArrowBackIcon />}</IconButton></Box>
          <Typography
            sx={{ flexGrow: 1 }}
            variant="h6"
          >CryptoPASS {smallScreen ? null : (
            <span style={{ fontSize: 12 }}>v{getSettings().data.version}</span>
          )}
          </Typography>
          {rrLocation.pathname === '/' ? (
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
              ><AddCircleIcon /></IconButton>
              <IconButton
                color="inherit"
                onClick={() => { rrNavigate('/settings') }}
              ><SettingsIcon /></IconButton>
              <IconButton
                sx={{ mr: { sm: 0.5 } }}
                color="inherit"
                aria-controls="menu-appbar"
                aria-haspopup="true"
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
                <MenuItem onClick={handleRoute} data-name='settings'>Settings</MenuItem>
                <MenuItem onClick={handleRoute} data-name='download'>Backup my Data</MenuItem>
                <MenuItem onClick={handleRoute} data-name='upload'>Restore my Backups</MenuItem>
              </Menu>
            </Box>
          ) : (null)}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;