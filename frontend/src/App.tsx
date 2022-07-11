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
import CreateReview from './pages/CreateReview';
import NotFound from './pages/NotFound';
import EditItem from './pages/Admin/EditItem';
import Login from './pages/Login';
import Orders from './pages/Orders';
import { useEffectOnce } from './hooks/UseEffectOnce';
import Cart from './pages/Cart';
import { retreiveTokens } from './helpers/utils';
import { UserContext } from './context/user';
import { ICartContext, IUserContext } from './interfaces';
import { http } from './helpers/utils';
import WithAxios from './helpers/WithAxios';
import AddItem from './pages/Admin/AddItem';
import RequireGuest from './components/Mixed/RequireGuest';
import RequireAdmin from './components/Mixed/RequireAdmin';
import RequireAuth from './components/Mixed/RequireAuth';
import Inventory from './pages/Admin/AdminInventory';
import AdminItem from './pages/Admin/AdminItem';
import Shop from './pages/Shop';
import SingleItem from './pages/SingleItem';
import BillingDetails from './pages/BillingDetails';
import { CartContext } from './context/cart';
import ForgotPassword from './pages/ForgotPassword';
import PasswordReset from './pages/PasswordReset';

function App() {
  const { setUser, user } = useContext(UserContext) as IUserContext;
  const { setGrandTotal } = useContext(CartContext) as ICartContext;
  const storeUser = useCallback(async () => {
    try {
      const tokens = retreiveTokens();
      const response = await http.get('/account/refresh/', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      setUser(response.data.user);
      localStorage.setItem(
        'is_superuser',
        JSON.stringify(response.data.user.is_superuser)
      );
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  }, [setUser]);

  const retreiveGrandTotal = async () => {
    try {
      const response = await http.get('carts/grand-total/');
      setGrandTotal(response.data.total);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    storeUser();
    retreiveGrandTotal();
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
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/password-reset" element={<PasswordReset />} />

                <Route
                  path="/create-account"
                  element={
                    <RequireGuest>
                      <CreateAccount />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RequireGuest>
                      <Login />
                    </RequireGuest>
                  }
                />
                <Route path="/orders/:userId" element={<Orders />} />
                <Route
                  path="/cart/:userId"
                  element={
                    <RequireAuth>
                      <Cart />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/reviews/"
                  element={
                    <RequireAuth>
                      <CreateReview />
                    </RequireAuth>
                  }
                />

                <Route
                  path="/billing-details/:userId"
                  element={
                    <RequireAuth>
                      <BillingDetails />
                    </RequireAuth>
                  }
                />

                <Route path="/items/:id" element={<SingleItem />} />
                <Route path="/shop" element={<Shop />} />

                <Route
                  path="/admin/add-item"
                  element={
                    <RequireAdmin>
                      <AddItem />
                    </RequireAdmin>
                  }
                />
                <Route
                  path="/admin/inventory"
                  element={
                    <RequireAdmin>
                      <Inventory />
                    </RequireAdmin>
                  }
                />

                <Route
                  path="/admin/items/:id"
                  element={
                    <RequireAdmin>
                      <AdminItem />
                    </RequireAdmin>
                  }
                />

                <Route
                  path="/admin/items/:id/edit"
                  element={
                    <RequireAdmin>
                      <EditItem />
                    </RequireAdmin>
                  }
                />

                <Route path="/*" element={<NotFound />} />
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
