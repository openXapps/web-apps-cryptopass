import { useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Material UI
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// App assets
import { AppContext } from './context/AppStore';
import light from './themes/light';
import dark from './themes/dark';

// App routes
import Header from './routes/Header';
import Home from './routes/Home';
import Edit from './routes/Edit';
import Settings from './routes/Settings';
import Download from './routes/Download';
import Upload from './routes/Upload';
import NoPage from './routes/NoPage';

function App() {
  const [appState] = useContext(AppContext);
  const appTheme = createTheme(appState.themeIsDark ? dark : light);
  const home = '/';
  // const home = '/apps/cryptopass';

  // https://reactrouter.com/docs/en/v6/getting-started/tutorial

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <BrowserRouter basename={home}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/download" element={<Download />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
