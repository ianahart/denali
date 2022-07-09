import { Box, Button, Heading, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { http } from '../helpers/utils';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { IRetreiveOrdersResponse, IOrder } from '../interfaces';
import { nanoid } from 'nanoid';
const Orders = () => {
  const { userId } = useParams();
  const [hasNext, setHasNext] = useState(false);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<IOrder[]>([]);

  const fetchOrders = async (endpoint: string) => {
    try {
      const response = await http.get<IRetreiveOrdersResponse>(endpoint);
      setOrders((prevState) => [...prevState, ...response.data.orders]);
      setHasNext(response.data.has_next);
      setPage(response.data.page);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  useEffectOnce(() => {
    fetchOrders(`/orders/?page=0&user=${userId}`);
  });

  return (
    <Box bg="#EAEDED" minH="100vh">
      <Box display="flex" margin="0 auto" justifyContent="center" maxWidth="1280px">
        <Box
          display="flex"
          justifyContent="space-between"
          p="0.5rem"
          mt="5rem"
          m="5rem auto 0 auto"
          bg="#FFF"
          minH="500px"
          width={['100%', '90%', '80%']}
        >
          <Box>
            <Heading
              borderBottom="1px solid #e8e8ea"
              width="200px"
              pb="0.25rem"
              color="text.secondary"
              fontSize="1rem"
              textTransform="uppercase"
              as="h3"
            >
              Orders
            </Heading>

            <Box mt="2rem">
              {orders.map((order) => {
                return (
                  <RouterLink to={`/items/${order.item_id}`}>
                    <Box my="1rem" boxShadow="md" p="0.25rem" key={nanoid()}>
                      <Box display="flex">
                        <Box display="flex" flexDir="column" alignItems="center">
                          <Text color="text.secondary" mb="0.25rem">
                            {order.name}
                          </Text>
                          <Image
                            width="150px"
                            height="150px"
                            src={order.product_url}
                            alt={order.name}
                          />
                        </Box>
                        <Box display="flex" flexDir="column" justifyContent="center">
                          <Text color="text.secondary">Ship to:</Text>
                          <Text
                            textTransform="uppercase"
                            fontWeight="bold"
                            color="text.secondary"
                          >
                            {order.street_address}
                          </Text>
                          {order.street_address_2 && (
                            <Text>{order.street_address_2}</Text>
                          )}
                          <Text
                            fontWeight="bold"
                            textTransform="uppercase"
                            color="text.secondary"
                          >
                            <Box as="span">{order.city} </Box>
                            <Box as="span">{order.state} </Box>
                            <Box as="span">{order.zip} </Box>
                          </Text>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <Text mx="1rem" fontWeight="bold">
                          {order.quantity}x
                        </Text>
                        <Text color="green">
                          <Box as="span" pr="1rem" color="text.secondary">
                            Total:
                          </Box>
                          ${order.total}
                        </Text>
                      </Box>
                    </Box>
                  </RouterLink>
                );
              })}
            </Box>
            {hasNext && (
              <Button
                onClick={() => fetchOrders(`/orders/?page=${page}&user=${userId}`)}
                color="purple.primary"
                bg="none"
                variant="main"
              >
                See more...
              </Button>
            )}
          </Box>

          <Box>
            <Heading
              borderBottom="1px solid #e8e8ea"
              width="200px"
              pb="0.25rem"
              color="text.secondary"
              fontSize="1rem"
              textTransform="uppercase"
              as="h3"
            >
              Returns
            </Heading>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Orders;
