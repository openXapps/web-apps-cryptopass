import { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Material UI
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// App assets
import { AppContext } from './context/AppStore';
import dark from './themes/dark';
import light from './themes/light';

// App routes
import Home from './routes/Home';

function App() {
  const [appState] = useContext(AppContext);
  const appTheme = createTheme(appState.theme.isDark ? dark : light);
  const home = '/';
  // const home = '/apps/cryptopass';

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter basename={home}>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
