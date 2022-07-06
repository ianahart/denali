import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserContextProvider from './context/user';
import ItemFormContextProvider from './context/itemForm';
import CartContextProvider from './context/cart';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <ItemFormContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </ItemFormContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
