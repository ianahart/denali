import { useContext, useState } from 'react';
import { Box, Text, Button, Select } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { IDeliveryDate, IItem, IUserContext } from '../../interfaces';
import { UserContext } from '../../context/user';
import { nanoid } from 'nanoid';
import { AiOutlineClose } from 'react-icons/ai';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';

interface IItemActionsProps {
  item: IItem;
  deliveryDate: IDeliveryDate;
}

const ItemActions = ({ item, deliveryDate }: IItemActionsProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const selectOptions = Array.from(Array(item.quantity), (val, key) => key + 1);
  const { user } = useContext(UserContext) as IUserContext;

  const addItemToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      if (!user.logged_in) {
        setModalOpen(true);
      }
      const discount = parseFloat(item.discount_price);
      const data = {
        user: user.id,
        item: item.id,
        name: item.name,
        quantity: quantity === 0 ? 1 : quantity,
        price: discount !== 0 ? discount : parseFloat(item.price),
      };

      await http.post('/carts/', data);
      navigate(`/cart/${user.id}`);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  const buyItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user.logged_in) {
      setModalOpen(true);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    if (e.target.value.toLowerCase() === '') return;
    setQuantity(parseInt(e.target.value));
  };

  return (
    <Box p="0.5rem" textAlign="center" margin=" 0 auto" mt="10rem">
      <Text color="text.secondary">
        Order within{' '}
        <Box as="span" color="green" fontWeight="bold">
          {deliveryDate.remaining_hrs} hrs
        </Box>{' '}
        and receive it by{' '}
        <Box as="span" fontWeight="bold">
          {deliveryDate.day}, {deliveryDate.one_week_date}
        </Box>
      </Text>
      {item.quantity > 0 ? (
        <Box>
          <Text textAlign="left" color="green" fontSize="1.2rem">
            In Stock
          </Text>

          <Select value={quantity} onChange={handleSelect} placeholder="Qty">
            {selectOptions.map((item) => {
              return (
                <option key={nanoid()} value={item}>
                  {item}
                </option>
              );
            })}
          </Select>
        </Box>
      ) : (
        <Text textAlign="left" color="red">
          Out of Stock
        </Text>
      )}

      <Box
        m="3rem auto 1rem auto"
        width={['50%', '50%', '50%']}
        alignItems="center"
        display="flex"
        flexDir="column"
      >
        {modalOpen && (
          <Box
            bg="rgba(0, 0, 0, 0.85)"
            width="100%"
            zIndex="5"
            position="absolute"
            top="0"
            margin="0 auto"
            left="0"
            height="100%"
          >
            <Box
              display="flex"
              minH="60vh"
              alignItems="center"
              justifyContent="center"
              flexDir="column"
            >
              <Box
                minH="200px"
                width={['100%', '400px', '400px']}
                bg="#FFF"
                boxShadow="md"
                borderRadius="md"
              >
                <Box
                  onClick={() => setModalOpen(false)}
                  display="flex"
                  cursor="pointer"
                  justifyContent="flex-end"
                  p="0.25rem"
                >
                  <AiOutlineClose fontSize="1.1rem" />
                </Box>

                <Text color="text.secondary">To continue please login</Text>
                <Text mt="1rem" color="text.secondary">
                  Not registered ?{' '}
                  <RouterLink to="/create-account">
                    <Box fontSize="0.9rem" color="purple.primary" as="span">
                      Create an account
                    </Box>
                  </RouterLink>
                </Text>
                <Box mt="3rem">
                  <Button
                    variant="main"
                    width="140px"
                    mx="0.5rem"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button mx="0.5rem" onClick={() => setModalOpen(false)}>
                    Keep Browsing
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
        <Button
          disabled={quantity === 0 ? true : false}
          onClick={addItemToCart}
          variant="main"
          bg="blue.primary"
          my="0.5rem"
        >
          Add to Cart
        </Button>
        <Button
          disabled={quantity === 0 ? true : false}
          onClick={buyItem}
          variant="main"
          my="0.5rem"
        >
          Buy Now
        </Button>
      </Box>
    </Box>
  );
};
export default ItemActions;
