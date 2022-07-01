import { Box, Button, Image } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
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

  const fetchItem = async () => {
    try {
      const response = await http.get<IAdminItemResponse>(`/admin/items/${id}/`);
      setItem(response.data.item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        navigate('/notfound');
      }
    }
  };

  useEffectOnce(() => {
    fetchItem();
  });

  console.log(item);
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
              <Button my="1rem" variant="main">
                Update
              </Button>
              <Button my="1rem" variant="main">
                Remove
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminItem;
