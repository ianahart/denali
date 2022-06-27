import React, { useContext, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Mixed/Footer';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { theme } from './theme/theme';
import './App.css';
import Navbar from './components/Navbar';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Orders from './pages/Orders';
import { useEffectOnce } from './hooks/UseEffectOnce';
import Cart from './pages/Cart';
import { retreiveTokens } from './helpers/utils';
import { UserContext } from './context/user';
import { IUserContext } from './interfaces';
import { http } from './helpers/utils';
import WithAxios from './helpers/WithAxios';
function App() {
  const { setUser } = useContext(UserContext) as IUserContext;
  const storeUser = useCallback(async () => {
    try {
      const tokens = retreiveTokens();
      const response = await http.get('/account/refresh/', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      setUser(response.data.user);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  }, [setUser]);

  useEffectOnce(() => {
    storeUser();
  });

  return (
    <ChakraProvider theme={theme}>
      <div className="site">
        <Router>
          <Navbar />
          <Box className="site-content">
            <WithAxios>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders/:orderId" element={<Orders />} />
                <Route path="/cart/:id" element={<Cart />} />
              </Routes>
            </WithAxios>
          </Box>
          <Footer />
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
