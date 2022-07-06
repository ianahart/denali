import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/cart';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { ICartContext, ICartResponse, IUserContext } from '../interfaces';
import CartItem from '../components/Items/CartItem';

const Cart = () => {
  const { setCart, grandTotal, cart, setGrandTotal } = useContext(
    CartContext
  ) as ICartContext;
  const { userId } = useParams();
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchCart = async (endpoint: string) => {
    try {
      const response = await http.get<ICartResponse>(endpoint);
      console.log(response);
      //@ts-ignore
      setCart((prevState) => [...prevState, ...response.data.cart]);

      setPage(response.data.page);
      setHasNext(response.data.has_next);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  const fetchGrandTotal = async (endpoint: string) => {
    try {
      const response = await http.get(endpoint);
      setGrandTotal(response.data.total);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };

  useEffectOnce(() => {
    setCart([]);
    fetchCart(`/carts/?user=${userId}&page=0`);
    fetchGrandTotal(`/carts/grand-total/`);
  });

  return (
    <Box minH="100vh" bg="#EAEDED">
      <Box display="flex" justifyContent="center" maxWidth="1280px">
        <Box p="0.5rem" mt="5rem" bg="#FFF" minH="500px" width={['100%', '90%', '80%']}>
          <Heading m="1rem" color="text.secondary" fontWeight="400">
            {cart.length === 0 ? 'Your Shopping Cart is Empty' : 'Shopping Cart'}
          </Heading>
          <Text
            color="text.secondary"
            fontSize="1.1rem"
            display="flex"
            justifyContent="flex-end"
          >
            Price
          </Text>
          <Box borderBottom="1px solid #EAEDED"></Box>
          <Box>
            {cart.map((item) => {
              return <CartItem key={item.id} item={item} />;
            })}
          </Box>
          {hasNext && (
            <Box
              display="flex"
              justifyContent="center"
              m="2.5rem auto 1rem auto"
              width="250px"
            >
              <Button
                onClick={() => fetchCart(`/carts/?user=${userId}&page=${page}`)}
                variant="main"
              >
                Load more...
              </Button>
            </Box>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Text>
              Grand Total:{' '}
              <Box color="green" as="span">
                ${grandTotal.toFixed(2)}
              </Box>
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
