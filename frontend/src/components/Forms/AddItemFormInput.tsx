import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

interface IAddItemFormInputProps {
  id: string;
  label: string;
  name: string;
  type: string;
  value: string;
  error: string;
  placeholder: string;
  updateForm: (name: string, value: string, key: string) => void;
}

const AddItemFormInput = ({
  id,
  label,
  name,
  type,
  value,
  error,
  placeholder,
  updateForm,
}: IAddItemFormInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
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
      <FormLabel color="text.primary" htmlFor={id}>
        {label}
      </FormLabel>
      <Input
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
        onChange={handleOnChange}
        pl="1.5rem"
        placeholder={placeholder}
        value={value}
        name={name}
        type={type}
        id={id}
        width="95%"
      />
      {error && (
        <Text color="text.primary" fontSize="0.85rem">
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default AddItemFormInput;
