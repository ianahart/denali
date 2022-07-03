import { Box, ListItem, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { UserContext } from '../../context/user';
import { IUserContext } from '../../interfaces';
import UserMenuContainer from '../Account/UserMenuContainer';
import UserMenuItems from '../Account/UserMenuItems';
import AdminMenuItems from '../Account/Admin/AdminMenuItems';
import Search from '../Items/Search';

const MenuItems = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <>
      <Search />
      {user.logged_in && (
        <ListItem
          id="trigger"
          onClick={() => setUserMenuOpen((prevState) => !prevState)}
          position="relative"
          cursor="pointer"
        >
          <Text
            mb="0"
            pointerEvents="none"
            ml="0.5rem"
            display="flex"
            alignItems="end"
            fontSize="0.9rem"
            color="#FFF"
          >
            Hello, {user.is_superuser ? 'Admin' : user.first_name}
          </Text>
          <Text pointerEvents="none" fontWeight="bold" color="#FFF">
            {user.is_superuser ? 'Admin Panel' : 'Account'}
          </Text>
        </ListItem>
      )}

      {userMenuOpen && (
        <UserMenuContainer userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen}>
          {user.is_superuser ? <AdminMenuItems /> : <UserMenuItems />}
        </UserMenuContainer>
      )}

      {!user.logged_in && (
        <ListItem m="0.5rem" color="#FFF">
          <RouterLink to="/create-account">
            <Box as="span" fontWeight="bold">
              Create Account
            </Box>
          </RouterLink>
        </ListItem>
      )}
      {!user.logged_in && (
        <ListItem m="0.5rem" color="#FFF">
          <RouterLink to="/login">
            <Box as="span" fontWeight="bold">
              Login
            </Box>
          </RouterLink>
        </ListItem>
      )}
      {user.logged_in && !user.is_superuser && (
        <ListItem m="0.5rem" color="#FFF">
          <RouterLink to="orders/32">
            <Text fontSize="0.9rem">Returns & </Text>
            <Text fontWeight="bold">Orders</Text>
          </RouterLink>
        </ListItem>
      )}

      {!user.logged_in && !user.is_superuser && (
        <ListItem m="0.5rem" color="#FFF">
          <RouterLink to="/shop">
            <Text fontWeight="bold" fontSize="0.9rem">
              Shop
            </Text>
          </RouterLink>
        </ListItem>
      )}

      {user.logged_in && !user.is_superuser && (
        <ListItem m="0.5rem" color="#FFF">
          <RouterLink to="cart/32">
            <AiOutlineShoppingCart fontSize="2rem" />
          </RouterLink>
        </ListItem>
      )}
    </>
  );
};

export default MenuItems;
