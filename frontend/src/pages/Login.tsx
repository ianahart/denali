import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import loginImage from '../images/login.png';
import FormInput from '../components/Forms/FormInput';
import { ICartContext, ILoginForm, ILoginResponse, IUserContext } from '../interfaces';
import { loginAccountState } from '../helpers/initialState';
import { CartContext } from '../context/cart';
import { AxiosError } from 'axios';
import { http } from '../helpers/utils';
import { UserContext } from '../context/user';
const Login = () => {
  const navigate = useNavigate();
  const { setUser, stowTokens } = useContext(UserContext) as IUserContext;
  const { setTotalCartItems } = useContext(CartContext) as ICartContext;
  const [form, setForm] = useState(loginAccountState);
  const [errors, setErrors] = useState([]);

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ILoginForm], [prop]: value },
    }));
  };

  const togglePasswordVisible = (type: string) => {
    setForm((prevState) => ({
      ...prevState,
      password: {
        ...prevState.password,
        type: type === 'password' ? 'text' : 'password',
      },
    }));
  };

  const fetchTotalCartItems = async () => {
    try {
      const response = await http.get('/carts/total/');
      setTotalCartItems(response.data.total);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrors([]);
      const response = await http.post<ILoginResponse>('/auth/login/', {
        email: form.email.value,
        password: form.password.value,
      });
      setUser(response.data.user);
      stowTokens(response.data.tokens);
      localStorage.setItem(
        'is_superuser',
        JSON.stringify(response.data.user.is_superuser)
      );
      await fetchTotalCartItems();
      navigate('/');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        for (const [key, error] of Object.entries(err.response.data.errors)) {
          setForm((prevState) => ({
            ...prevState,
            //@ts-ignore
            [key]: { ...prevState[key as keyof ILoginForm], error: error[0] },
          }));
        }
      }
    }
  };

  return (
    <Box
      display="flex"
      flexDir="column"
      alignItems="center"
      padding="10rem 0 2rem 0"
      minH="100vh"
      backgroundSize="cover"
      backgroundImage={loginImage}
    >
      <Box
        width={['100%', '100%', '450px']}
        border="1px solid"
        borderColor="#e7ebe7"
        boxShadow="md"
        bg="#FFF"
        borderRadius="md"
        minH="500px"
      >
        <Heading color="text.primary" mt="3rem" textAlign="center" as="h2">
          Login
        </Heading>
        <Box display="flex" justifyContent="center" mt="2rem">
          <Text color="text.primary" fontSize="0.9rem">
            Not Registered?{' '}
            <Box as="span" color="purple.primary">
              <RouterLink color="blue" to="/create-account">
                Create an account
              </RouterLink>
            </Box>
          </Text>
        </Box>
        <form onSubmit={handleOnSubmit}>
          <Box m="3rem auto 2rem auto" pl="0.5rem">
            <FormInput
              togglePasswordVisible={togglePasswordVisible}
              updateForm={updateForm}
              name={form.email.name}
              id="email"
              error={form.email.error}
              value={form.email.value}
              type="email"
              label="Email"
              icon={AiOutlineMail}
            />

            <FormInput
              togglePasswordVisible={togglePasswordVisible}
              updateForm={updateForm}
              name={form.password.name}
              id="password"
              error={form.password.error}
              value={form.password.value}
              type={form.password.type}
              label="Password"
              icon={AiOutlineLock}
            />
          </Box>
          <Box display="flex" pt="1.5rem" justifyContent="center">
            <Button type="submit" variant="main">
              Login
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
