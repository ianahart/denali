import { FormControl, Icon, FormLabel, Input, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

interface InputProps {
  name: string;
  id: string;
  error: string;
  value: string;
  icon: IconType;
  label: string;
  type: string;
  updateForm: (name: string, value: string, prop: string) => void;
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
      {error && (
        <Text fontSize="0.8rem" color="#ff0033">
          {error}
        </Text>
      )}
    </FormControl>
  );
};
export default FormInput;
