import { Box, Button, Heading } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { AiOutlineLock, AiOutlineMail, AiOutlineUser } from 'react-icons/ai';
import createAccountImage from '../images/create-account.png';
import { createAccountState } from '../helpers/initialState';
import FormInput from '../components/Forms/FormInput';
import { ICreateForm } from '../interfaces';
import { http } from '../helpers/utils';
const CreateAccount = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(createAccountState);

  const applyValidationErrors = <T,>(errors: T) => {
    if (!Object.keys(errors).length) return;
    for (const [prop, error] of Object.entries(errors)) {
      setForm((prevState) => ({
        ...prevState,
        [prop]: { ...prevState[prop as keyof ICreateForm], error },
      }));
    }
  };

  const togglePasswordVisible = (type: string) => {
    setForm((prevState) => {
      return {
        ...prevState,
        password: {
          ...prevState.password,
          type: type === 'password' ? 'text' : 'password',
        },
        confirm_password: {
          ...prevState.confirm_password,
          type: type === 'password' ? 'text' : 'password',
        },
      };
    });
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await http.post('auth/register/', {
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        email: form.email.value,
        password: form.password.value,
        confirm_password: form.confirm_password.value,
      });
      navigate('/login');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        applyValidationErrors(err.response.data.errors);
      }
    }
  };

  const updateForm = (name: string, value: string, prop: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof ICreateForm], [prop]: value },
    }));
  };

  return (
    <Box
      minH="100vh"
      backgroundSize="cover"
      display="flex"
      flexDir="column"
      alignItems="center"
      margin="10rem auto 2rem auto"
      backgroundImage={createAccountImage}
    >
      <Box
        width={['100%', '100%', '450px']}
        border="1px solid"
        borderColor="#e7ebe7"
        boxShadow="md"
        borderRadius="md"
        bg="#FFF"
        minH="550px"
      >
        <Heading color="text.primary" mt="3rem" textAlign="center" as="h2">
          Create Account
        </Heading>
        <Box p="0.5rem" margin="3rem auto 1rem auto">
          <form onSubmit={handleOnSubmit}>
            <Box display="flex">
              <FormInput
                togglePasswordVisible={togglePasswordVisible}
                updateForm={updateForm}
                name={form.first_name.name}
                id="first_name"
                error={form.first_name.error}
                value={form.first_name.value}
                type="text"
                label="First Name"
                icon={AiOutlineUser}
              />
              <FormInput
                togglePasswordVisible={togglePasswordVisible}
                updateForm={updateForm}
                name={form.last_name.name}
                id="last_name"
                error={form.last_name.error}
                value={form.last_name.value}
                type="text"
                label="Last Name"
                icon={AiOutlineUser}
              />
            </Box>

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
            <FormInput
              togglePasswordVisible={togglePasswordVisible}
              updateForm={updateForm}
              name={form.confirm_password.name}
              id="confirm_password"
              error={form.confirm_password.error}
              value={form.confirm_password.value}
              type={form.confirm_password.type}
              label="Confirm Password"
              icon={AiOutlineLock}
            />
            <Box display="flex" justifyContent="center" my="1.5rem">
              <Button type="submit" variant="main">
                Create
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateAccount;
