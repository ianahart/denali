import { Box, Button, Image, Input, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminItemState } from '../../helpers/initialState';
import { IAdminItemResponse, IItem } from '../../interfaces';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import ItemDetails from '../../components/Items/ItemDetails';

const AdminItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<IItem>(adminItemState);
  const [discount, setDiscount] = useState({ value: '', error: '' });
  const fetchItem = async () => {
    try {
      const response = await http.get<IAdminItemResponse>(`/admin/items/${id}/`);
      setItem(response.data.item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404) {
          navigate('/notfound');
        }
      }
    }
  };

  useEffectOnce(() => {
    fetchItem();
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDiscount((prevState) => ({
      ...prevState,
      value: e.target.value,
    }));
  };

  const changeDiscount = async () => {
    try {
      setDiscount((prevState) => ({ ...prevState, error: '' }));
      const response = await http.patch(`/admin/items/${item.id}/discount/`, {
        discount: discount.value,
      });
      const discounted = response.data.discount;
      setItem((prevState) => ({ ...prevState, discount: discounted }));
      setDiscount({ value: '', error: '' });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        const error = err.response.data.discount;
        setDiscount((prevState) => ({
          ...prevState,
          error,
        }));
      }
    }
  };

  return (
    <Box minH="100vh" mt="3rem">
      <Box className="admin-item-container" display="flex" margin="0 auto">
        <Box p="0.5rem" minH="100vh">
          <Box className="admin-item-inner-container">
            <Image width="600px" src={item.product_url} alt={item.name} />
          </Box>
        </Box>
        <Box p="0.5rem" mr="0.5rem" minH="100vh" bg="#fbf8f8">
          <Box className="admin-item-inner-container">
            <ItemDetails item={item} />
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          border="1px solid #d5d6d5"
          borderRadius="8px"
          p="0.5rem"
          minH="100vh"
          flexGrow="1"
        >
          <Box className="admin-item-inner-container">
            <Box textAlign="center" margin="0 auto" mt="4rem">
              <RouterLink to={`/admin/items/${item.id}/edit`}>
                <Button my="1rem" variant="main">
                  Update
                </Button>
              </RouterLink>
              <Button my="1rem" variant="main">
                Remove
              </Button>
            </Box>
            <Box mt="3rem">
              <Text color="text.primary">Change Discount:</Text>
              <Box display="flex">
                <Input
                  placeholder="ex 10..."
                  value={discount.value}
                  onChange={handleOnChange}
                  type="text"
                />
                <Button onClick={changeDiscount} ml="0.25rem">
                  Change
                </Button>
              </Box>
              {discount.error && <Text>{discount.error}</Text>}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminItem;
