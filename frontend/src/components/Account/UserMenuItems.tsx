import { Box, Heading, ListItem, UnorderedList, Text } from '@chakra-ui/react';
import { Axios, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../context/user';
import { tokenState, userState } from '../../helpers/initialState';
import { http } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';

const UserMenuItems = () => {
  const { user, setUser, setTokens, tokens } = useContext(UserContext) as IUserContext;
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await http.post('/auth/logout/', {
        id: user.id,
        refresh_token: tokens.refresh_token,
      });

      setUser(userState);
      localStorage.removeItem('tokens');
      setTokens({ refresh_token: '', access_token: '' });
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        return;
      }
    }
  };

  return (
    <Box>
      <Box p="0.5rem">
        <Heading textAlign="center" mt="1.5rem" color="text.primary" fontSize="20px">
          Your Account
        </Heading>
        <Box
          width="150px"
          margin="0.3rem auto 0 auto"
          height="4px"
          bg="purple.primary"
        ></Box>
        <UnorderedList
          textAlign="left"
          p="0"
          display="flex"
          flexDir="column"
          justifyContent="center"
          listStyleType="none"
        >
          <ListItem onClick={logout} my="0.5rem" cursor="pointer">
            <Text color="text.primary" _hover={{ opacity: 0.8 }} role="button">
              Sign out
            </Text>
          </ListItem>
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default UserMenuItems;
