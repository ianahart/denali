import {
  Box,
  Heading,
  Text,
  Radio,
  Image,
  RadioGroup,
  Stack,
  Textarea,
  Button,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState, useEffect, useContext, ChangeEvent } from 'react';
import { ItemFormContext } from '../../context/itemForm';
import { UserContext } from '../../context/user';
import { itemFormState } from '../../helpers/initialState';
import { http } from '../../helpers/utils';
import { IItemFormContext, IItem, IUserContext, IItemForm } from '../../interfaces';
import AddItemFormInput from './AddItemFormInput';
import ItemFileUpload from './ItemFileUpload';
import loader from '../../images/loader.svg';

interface IItemFormProps {
  title: string;
  buttonText: string;
  action: string;
  item: undefined | IItem;
}

const ItemForm = ({ title, buttonText, action, item }: IItemFormProps) => {
  const [resize, setResize] = useState('horizontal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext) as IUserContext;
  const { getFormValues, setFile, setBase64, form, setForm, handleUpdateForm } =
    useContext(ItemFormContext) as IItemFormContext;

  useEffect(() => {
    setForm(itemFormState);
    setFile(null);
    setBase64('');

    if (item !== undefined) {
      const form: any = {};
      Object.entries({ ...item }).forEach(([key, value]) => {
        form[key] = { name: key, error: '', value: value };
      });
      setForm(form);
      setBase64(item.product_url);
    }
  }, [item, setForm, setFile, setBase64]);

  const updateForm = (name: string, value: string, key: string) => {
    handleUpdateForm(name, value, key);
  };

  const handleOnTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    handleUpdateForm(name, value, 'value');
  };

  const applyErrors = <T,>(errors: T) => {
    for (const [key, val] of Object.entries(errors)) {
      handleUpdateForm(key, val[0], 'error');
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError('');
      setLoading(true);
      const formData = getFormValues(form, user.id);
      let response;
      if (action === 'post') {
        response = await http.post('/admin/items/', formData, {
          headers: { 'content-type': 'multipart/form-data' },
        });
      } else {
        if (item === undefined) return;
        response = await http.put(`/admin/items/${item.id}/`, formData, {
          headers: { 'content-type': 'multipart/form-data' },
        });
      }

      setForm(itemFormState);
      setLoading(false);
      setFile(null);
      setBase64('');
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        setLoading(false);
        if (Object.keys(err.response.data).includes('file')) {
          setError(err.response.data.file.file);
          return;
        }
        applyErrors(err.response.data.errors);
      }
    }
  };

  return (
    <Box
      width={['100%', '100%', '700px']}
      borderRadius="md"
      borderBottom="none"
      minH="100vh"
    >
      <Heading textAlign="center" mt="3rem" fontSize="1.7rem" color="text.primary">
        {title}
      </Heading>
      <Box
        width="250px"
        margin="0.3rem auto 0 auto"
        height="4px"
        bg="purple.primary"
      ></Box>

      <form onSubmit={handleOnSubmit} style={{ padding: '0.5rem' }}>
        <AddItemFormInput
          updateForm={updateForm}
          value={form.name.value}
          name={form.name.name}
          error={form.name.error}
          id="name"
          type="text"
          label="Name of product"
          placeholder="Product..."
        />

        <Box display="flex" mt="3rem" flexDir={['column', 'column', 'row']}>
          <AddItemFormInput
            updateForm={updateForm}
            value={form.price.value}
            name={form.price.name}
            error={form.price.error}
            id="price"
            type="text"
            label="Price of product"
            placeholder="Price..."
          />

          <AddItemFormInput
            updateForm={updateForm}
            value={form.size.value}
            name={form.size.name}
            error={form.size.error}
            id="size"
            type="text"
            label="Size of product"
            placeholder="Size..."
          />

          <AddItemFormInput
            updateForm={updateForm}
            value={form.quantity.value}
            name={form.quantity.name}
            error={form.quantity.error}
            id="quantity"
            type="number"
            label="Quantity of product"
            placeholder="Quantity..."
          />
        </Box>
        <>
          <RadioGroup mt="2rem" defaultValue={resize} onChange={setResize} mb={6}>
            <Stack direction="row" spacing={5}>
              <Radio value="horizontal">Horizontal</Radio>
              <Radio value="vertical">Vertical</Radio>
              <Radio color="green" value="none">
                None
              </Radio>
            </Stack>
          </RadioGroup>
          <Textarea
            borderRadius="10px"
            name={form.description.name}
            value={form.description.value}
            onChange={handleOnTextAreaChange}
            placeholder="Description of product..."
            size="sm"
            // @ts-ignore
            resize={resize}
          />
        </>
        <ItemFileUpload />
        <Box
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          my="2.5rem"
        >
          {error && (
            <Text mb="2rem" fontSize="0.85rem" color="text.primary">
              {error}
            </Text>
          )}
          {loading ? (
            <Image width="100px" height="100px" src={loader} alt="loading indicator" />
          ) : (
            <Button type="submit" width="50%" variant="main">
              {buttonText}
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default ItemForm;
