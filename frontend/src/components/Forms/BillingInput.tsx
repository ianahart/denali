import { Box, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';

export interface IBillingInputProps {
  updateForm: (name: string, value: string, prop: string) => void;
  name: string;
  value: string;
  error: string;
  required: boolean;
  type: string;
  label: string;
  placeholder: string;
}

const BillingInput = ({
  updateForm,
  name,
  value,
  error,
  required,
  type,
  label,
  placeholder,
}: IBillingInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateForm(name, value, 'value');
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const ignore = ['street_address_2', 'company'];
    if (ignore.includes(name)) return;
    if (value.trim().length === 0 || value.trim().length > 200) {
      const error = 'Field must not be empty and must be less than 200 characters.';
      updateForm(name, error, 'error');
    }
  };

  const handleOnFocus = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateForm(e.target.name, '', 'error');
  };

  return (
    <FormControl my="1rem">
      <Box position="relative">
        {required && (
          <Text position="absolute" top="0" right="0" color="red">
            &#42;
          </Text>
        )}
        <FormLabel color="#a7aba7" ml="1rem" htmlFor={name}>
          {label}
        </FormLabel>
      </Box>
      <Input
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        mx="1rem"
        width="90%"
      />
      {error && (
        <Text fontSize="0.8rem" color="#ff0033">
          {error}
        </Text>
      )}
    </FormControl>
  );
};

export default BillingInput;
