import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import loader from '../images/loader.svg';

import forgotPasswordBG from '../images/forgot-password.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loaded, setLoaded] = useState(true);

  const sendEmail = async () => {
    try {
      setError('');
      setMsg('');
      setLoaded(false);
      await http.post('/auth/forgot-password/', { email });
      setMsg('Please check your email.');
      setLoaded(true);
      setEmail('');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setLoaded(true);
        if (err.response.status === 400) {
          setError(err.response.data.errors.email);
          return;
        }
        setError(err.response.data.errors);
      }
    }
  };

  return (
    <Box minH="100vh" backgroundSize="cover" backgroundImage={forgotPasswordBG}>
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
              Forgot Password
            </Heading>
          </Box>
          {error && (
            <Text fontSize="0.85rem" textAlign="center" color="red">
              {error}
            </Text>
          )}
          <FormControl>
            <FormLabel>Your Email</FormLabel>
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Email..."
              type="text"
            />
          </FormControl>
          {!loaded ? (
            <Box display="flex" justifyContent="center">
              <Image width="75px" height="75px" src={loader} />
            </Box>
          ) : (
            <Box
              my="2rem"
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="purple.primary" mb="1rem">
                {msg}
              </Text>
              <Button onClick={sendEmail} variant="main">
                Forgot Password
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
