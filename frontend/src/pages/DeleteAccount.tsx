import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user';
import { http } from '../helpers/utils';
import deleteAccountBG from '../images/delete-account.png';
import { IUserContext } from '../interfaces';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as IUserContext;
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const deleteAccount = async () => {
    try {
      setError('');
      const response = await http.delete(`/account/${user.id}?email=${inputValue}`);
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setError(err.response.data.errors);
      }
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Box minH="100vh" backgroundSize="cover" backgroundImage={deleteAccountBG}>
      <Box
        minH="50vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
      >
        <Box
          p="0.5rem"
          borderRadius="md"
          minH="200px"
          width={['100%', '450px', '450px']}
          bg="#FFF"
          boxShadow="md"
        >
          <Box mb="2rem" textAlign="center">
            <Heading fontSize="1.5rem" color="text.secondary">
              Delete Account
            </Heading>
          </Box>

          <FormControl>
            <FormLabel>Enter Email:</FormLabel>
            {error && (
              <Text fontSize="0.85rem" color="red">
                {error}
              </Text>
            )}
            <Input
              value={inputValue}
              onChange={handleOnChange}
              type="text"
              placeholder="Your account email..."
            />
          </FormControl>
          <Box my="2rem" display="flex" justifyContent="center">
            <Button onClick={deleteAccount} width="200px" variant="main">
              Delete Account
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DeleteAccount;
