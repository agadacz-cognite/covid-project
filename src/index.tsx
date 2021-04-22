import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import AppContextProvider from './context';

import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
