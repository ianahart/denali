import { Box, Input, ListItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
const MenuItems = () => {
  return (
    <>
      <Box color="#FFF" position="relative" width="50%">
        <Input
          border="1px solid"
          borderColor="purple.primary"
          color="#FFF"
          width="100%"
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          top="1px"
          height="38px"
          width="38px"
          borderRadius="4px"
          zIndex="3"
          right="1px"
          bg="purple.primary"
          position="absolute"
        >
          <AiOutlineSearch fontSize="2rem" />
        </Box>
      </Box>
      <ListItem m="0.5rem" color="#FFF">
        <RouterLink to="/create-account">Create Account</RouterLink>
      </ListItem>
      <ListItem m="0.5rem" color="#FFF">
        <RouterLink to="/login">Login</RouterLink>
      </ListItem>
      <ListItem m="0.5rem" color="#FFF">
        <RouterLink to="orders/32">Orders</RouterLink>
      </ListItem>
      <ListItem m="0.5rem" color="#FFF">
        <RouterLink to="cart/32">
          <AiOutlineShoppingCart fontSize="2rem" />
        </RouterLink>
      </ListItem>
    </>
  );
};

export default MenuItems;
