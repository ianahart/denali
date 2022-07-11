import { Box, Button, FormLabel, Heading, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { IPasswordForm } from '../interfaces';
import passwordResetBG from '../images/password-reset.png';
import { PasswordResetState } from '../helpers/initialState';

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<IPasswordForm>(PasswordResetState);

  const resetPassword = async () => {
    try {
      const response = await http.post('/auth/password-reset/', {
        token: searchParams.get('token'),
        password: form.password.value,
        confirm_password: form.confirm_password.value,
      });
      console.log(response);
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          const { errors } = err.response.data;
          updateForm('password', errors.password[0], 'error');
        }
      }
    }
  };

  const updateForm = (name: string, value: string, type: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name as keyof IPasswordForm],
        [type]: value,
      },
    }));
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim().length < 6 || value.trim().length > 200) {
      const error = 'Password must be between 6 and 200 characters.';
      updateForm(name, error, 'error');
    }
  };

  const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    updateForm(name, '', 'error');
  };

  const togglePasswordVisibility = () => {
    if (form.password.type === 'password') {
      updateForm('password', 'text', 'type');
      updateForm('confirm_password', 'text', 'type');
      return;
    }
    updateForm('password', 'password', 'type');
    updateForm('confirm_password', 'password', 'type');
  };

  return (
    <Box backgroundImage={passwordResetBG} minH="100vh" backgroundSize="cover">
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="50vh"
      >
        <Box
          p="0.5rem"
          borderRadius="md"
          minH="200px"
          width={['100%', '450px', '450px']}
          bg="#FFF"
          boxShadow="md"
        >
          <Box my="1rem" mb="2rem" textAlign="center">
            <Heading fontSize="1.5rem" color="text.secondary">
              Password Reset
            </Heading>
          </Box>
          <Box my="1rem">
            <FormLabel>New Password:</FormLabel>
            {form.password.error && (
              <Text color="red" fontSize="0.85rem">
                {form.password.error}
              </Text>
            )}
            <Box position="relative">
              <Input
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onChange={handleOnChange}
                name={form.password.name}
                value={form.password.value}
                type={form.password.type}
              />
              <Box
                onClick={togglePasswordVisibility}
                position="absolute"
                cursor="pointer"
                top="4px"
                right="3px"
              >
                {form.password.type === 'text' ? (
                  <AiOutlineEyeInvisible fontSize="1.2rem" color="text.primary" />
                ) : (
                  <AiOutlineEye fontSize="1.2rem" color="text.primary" />
                )}
              </Box>
            </Box>
          </Box>

          <Box my="1rem">
            <FormLabel>Confirm Password:</FormLabel>

            {form.confirm_password.error.length > 0 && (
              <Text color="red" fontSize="0.85rem">
                {form.confirm_password.error}
              </Text>
            )}

            <Input
              onFocus={handleOnFocus}
              onBlur={handleOnBlur}
              onChange={handleOnChange}
              name={form.confirm_password.name}
              value={form.confirm_password.value}
              type={form.confirm_password.type}
            />
          </Box>

          <Box display="flex" justifyContent="center">
            <Button onClick={resetPassword} variant="main">
              Reset Password
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PasswordReset;
