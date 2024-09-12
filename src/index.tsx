import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//Sisense context Provider for Authenticating SDK requests
import { SisenseContextProvider } from '@sisense/sdk-ui';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <SisenseContextProvider
        url="YOURSISENSEURL" // replace with the URL of your Sisense instance
        token="YOURAPITOKEN" >
    <App />
    </SisenseContextProvider>
  </React.StrictMode>
);

reportWebVitals();
