import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppStore from './context/AppStore';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppStore><App /></AppStore>
  </React.StrictMode>
);

