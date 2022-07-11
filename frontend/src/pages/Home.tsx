import { AxiosError } from 'axios';
import { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Text, Image, Heading } from '@chakra-ui/react';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import homeBG from '../images/home.png';
import { UserContext } from '../context/user';
import { IMarketingResponse, IUserContext, IMarketingItem, IItem } from '../interfaces';
import { http } from '../helpers/utils';
import { adminItemState, marketingItemState } from '../helpers/initialState';
const Home = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [searchedItem, setSearchedItem] = useState<IMarketingItem>(marketingItemState);
  const [orderItem, setOrderItem] = useState<IMarketingItem>(marketingItemState);
  const [saleItem, setSaleItem] = useState<IItem>(adminItemState);
  // recent search, random item, order buy again
  const fetchItemContent = async () => {
    try {
      const response = await http.get<IMarketingResponse>('/items/marketing/');
      if (!user.logged_in) {
        setSaleItem(response.data.on_sale_item);
        return;
      }
      setSearchedItem(response.data.searched_item);
      setOrderItem(response.data.order);
      setSaleItem(response.data.on_sale_item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404) {
          setSearchedItem(marketingItemState);
        }
        return;
      }
    }
  };

  useEffectOnce(() => {
    fetchItemContent();
  });

  return (
    <Box minH="100vh" backgroundImage={homeBG} backgroundSize="cover">
      <Box
        pt="14rem"
        display="grid"
        gap="20px"
        gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
      >
        {searchedItem.id !== 0 && (
          <Box mb="1rem" justifySelf="center" minH="400px">
            <RouterLink to={`/items/${searchedItem.id}`}>
              <Heading
                mb="1rem"
                textAlign="center"
                fontSize="1.5rem"
                color="text.secondary"
              >
                Keep Looking
              </Heading>
            </RouterLink>
            <Box boxShadow="md">
              <Box color="text.secondary" display="flex">
                <Text fontWeight="bold" mx="1rem">
                  {searchedItem.name}
                </Text>
                <Text fontWeight="bold" mx="1rem">
                  {searchedItem.size}
                </Text>
              </Box>
              <Box>
                <Image width="300px" minHeight="300px" src={searchedItem.product_url} />
              </Box>
            </Box>
          </Box>
        )}

        {saleItem.id !== 0 && (
          <Box mb="1rem" justifySelf="center" minH="400px">
            <RouterLink to={`/items/${saleItem.id}`}>
              <Heading
                mb="1rem"
                textAlign="center"
                fontSize="1.5rem"
                color="text.secondary"
              >
                On Sale
              </Heading>
            </RouterLink>
            <Box boxShadow="md" height="400px">
              <Box color="text.secondary" display="flex">
                <Text fontWeight="bold" mx="1rem">
                  {saleItem.name}
                </Text>
                <Text fontWeight="bold" mx="1rem">
                  {saleItem.size}
                </Text>
              </Box>
              <Box>
                <Image width="300px" height="300px" src={saleItem.product_url} />
              </Box>
              <Box display="flex" p="0.5rem" position="relative">
                <Text color="text.secondary">${saleItem.price}</Text>
                <Box
                  top="17px"
                  position="absolute"
                  height="3px"
                  width="60px"
                  bg="gray"
                ></Box>
                <Text mx="1rem" color="green" fontWeight="bold">
                  ${saleItem.discount_price}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        {orderItem.id !== 0 && (
          <Box mb="1rem" justifySelf="center" minH="400px">
            <RouterLink to={`/items/${orderItem.id}`}>
              <Heading
                mb="1rem"
                textAlign="center"
                fontSize="1.5rem"
                color="text.secondary"
              >
                Buy Again
              </Heading>
            </RouterLink>
            <Box boxShadow="md">
              <Box color="text.secondary" display="flex">
                <Text fontWeight="bold" mx="1rem">
                  {orderItem.name}
                </Text>
                <Text fontWeight="bold" mx="1rem">
                  {orderItem.size}
                </Text>
              </Box>
              <Box>
                <Image width="300px" height="300px" src={orderItem.product_url} />
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
