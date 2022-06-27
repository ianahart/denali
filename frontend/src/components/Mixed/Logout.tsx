import { ListItem, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { http } from '../../helpers/utils';
import { userState } from '../../helpers/initialState';
import { IUserContext } from '../../interfaces';
import { UserContext } from '../../context/user';

const Logout = () => {
  const { user, setUser, setTokens, tokens } = useContext(UserContext) as IUserContext;
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await http.post('/auth/logout/', {
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
    <ListItem onClick={logout} my="0.5rem" cursor="pointer">
      <Text color="text.primary" _hover={{ opacity: 0.8 }} role="button">
        Sign out
      </Text>
    </ListItem>
  );
};

export default Logout;
