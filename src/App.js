import { useContext } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

// Material UI
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// App assets
import { AppContext } from './context/AppStore';
import light from './themes/light';
import dark from './themes/dark';

// App routes
import Layout from './routes/Layout';
import Home from './routes/Home';
import Edit from './routes/Edit';
import Settings from './routes/Settings';
import Download from './routes/Download';
import Upload from './routes/Upload';
import NoPage from './routes/NoPage';

export default function App() {
  const [appState] = useContext(AppContext);
  const appTheme = createTheme(appState.themeIsDark ? dark : light);
  const home = '/apps/cryptopass';
  // const home = '/';

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="edit" element={<Edit />}>
        <Route path=":passwordId" element={<Edit />} />
        <Route path="new" element={<Edit />} />
      </Route>
      <Route path="settings" element={<Settings />} />
      <Route path="download" element={<Download />} />
      <Route path="upload" element={<Upload />} />
      <Route path="*" element={<NoPage />} />
    </Route >
  ), { basename: home });

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}


