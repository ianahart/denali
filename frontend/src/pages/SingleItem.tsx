import { useParams, useNavigate } from 'react-router-dom';
import { Box, Image } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IItem, IItemResponse, IDeliveryDate } from '../interfaces';
import { http } from '../helpers/utils';
import { adminItemState } from '../helpers/initialState';
import ItemDetails from '../components/Items/ItemDetails';
import ItemActions from '../components/Items/ItemActions';

const SingleItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<IItem>(adminItemState);
  const [deliveryDate, setDeliveryDate] = useState<IDeliveryDate>({
    day: '',
    one_week_date: '',
    remaining_hrs: 0,
  });

  const getItem = async () => {
    try {
      const response = await http.get<IItemResponse>(`/items/${id}/`);
      setItem(response.data.item);
      setDeliveryDate(response.data.date);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 404) {
          navigate('/notfound');
        }
      }
    }
  };

  useEffectOnce(() => {
    getItem();
  });

  return (
    <Box minH="100vh">
      <Box
        p="5rem 0 1rem 0"
        className="single-item-page-wrapper"
        maxWidth="1200px"
        display="flex"
        margin="0 auto"
      >
        <Box className="single-item-container-one" minH="100vh">
          <Box
            display="flex"
            justifyContent="space-between"
            flexDir={['column', 'column', 'row']}
          >
            <Box p="1rem" width={['100%', '100%', '40%']} margin="0 auto">
              <Image src={item.product_url} alt={item.name} />
            </Box>
            <Box
              bg="#fef7f7"
              borderRadius="md"
              width={['100%', '100%', '60%']}
              p="0.5rem"
            >
              <ItemDetails item={item} />
            </Box>
          </Box>
        </Box>
        <Box
          className="single-item-container-two"
          minH="100vh"
          border="1px solid #ececf4"
          borderRadius="md"
        >
          <ItemActions item={item} deliveryDate={deliveryDate} />
        </Box>
      </Box>
    </Box>
  );
};

export default SingleItem;
