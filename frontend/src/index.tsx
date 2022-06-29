import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserContextProvider from './context/user';
import ItemFormContextProvider from './context/itemForm';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <ItemFormContextProvider>
        <App />
      </ItemFormContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
