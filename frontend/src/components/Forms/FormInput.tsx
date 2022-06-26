import { FormControl, Icon, FormLabel, Input, Text, IconButton } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface InputProps {
  name: string;
  id: string;
  error: string;
  value: string;
  icon: IconType;
  label: string;
  type: string;
  updateForm: (name: string, value: string, prop: string) => void;
  togglePasswordVisible: (type: string) => void;
}

const FormInput = ({
  name,
  id,
  error,
  value,
  icon,
  label,
  type,
  updateForm,
  togglePasswordVisible,
}: InputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm(e.target.name, e.target.value, 'value');
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim().length > 200 || e.target.value.trim().length === 0) {
      const error = `${label} cannot be empty and has a maximum of 200 characters.`;
      updateForm(e.target.name, error, 'error');
    }
  };

  const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm(e.target.name, '', 'error');
  };

  return (
    <FormControl mb="1.5rem" position="relative">
      <Icon
        color="text.primary"
        position="absolute"
        left="5px"
        top="40px"
        fontSize="1.1rem"
        as={icon}
      />
      <FormLabel color="text.primary" htmlFor={id}>
        {label}
      </FormLabel>
      <Input
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        pl="1.5rem"
        value={value}
        name={name}
        type={type}
        id={id}
        width="95%"
      />
      {name === 'password' && (
        <IconButton
          onClick={() => togglePasswordVisible(type)}
          aria-label="toggle password visibility"
          background="transparent"
          color="text.primary"
          cursor="pointer"
          _hover={{ background: 'transparent' }}
          _active={{ background: 'transparent' }}
          position="absolute"
          right="15px"
          top="35px"
          width="20px"
          height="20px"
          icon={type === 'text' ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
        />
      )}
      {error && (
        <Text fontSize="0.8rem" color="#ff0033">
          {error}
        </Text>
      )}
    </FormControl>
  );
};
export default FormInput;
