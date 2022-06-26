import React from 'react';
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
import Cart from './pages/Cart';
function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className="site">
        <Router>
          <Navbar />
          <Box className="site-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders/:orderId" element={<Orders />} />
              <Route path="/cart/:id" element={<Cart />} />
            </Routes>
          </Box>
          <Footer />
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
