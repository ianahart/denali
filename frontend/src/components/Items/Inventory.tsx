import { Box, Button, Text } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useState } from 'react';
import ItemCard from '../../components/Items/ItemCard';
import { http } from '../../helpers/utils';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import { nanoid } from 'nanoid';
import { AdminItemsResponse, IItem } from '../../interfaces';

interface IIventoryProps {
  endpoint: string;
  itemPath: string;
}

const Inventory = ({ endpoint, itemPath }: IIventoryProps) => {
  const [items, setItems] = useState<IItem[]>([]);
  const [pageRange, setPageRange] = useState<(string | number)[]>([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [hasNext, setHasNext] = useState(false);

  const loadInventory = async () => {
    try {
      const response = await http.get<AdminItemsResponse>(
        `${endpoint}/?page=0&direction=direction`
      );
      setItems(response.data.items);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
      setPageRange(response.data.page_range);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.errors);
      }
    }
  };

  const paginate = async (direction: string) => {
    try {
      const response = await http.get(`${endpoint}/?page=${page}&direction=${direction}`);
      setItems(response.data.items);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
      setPageRange(response.data.page_range);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.errors);
      }
    }
  };

  useEffectOnce(() => {
    loadInventory();
  });

  return (
    <Box>
      <Box display="flex" flexDir="column" justifyContent="space-between" minH="100vh">
        <Box flex={1} display="flex" flexDir={['column', 'column', 'row']} minH="100vh">
          <Box
            width={['100%', '100%', '300px']}
            minH="100vh"
            borderRight="1px solid"
            borderColor="#e7ebe7"
          ></Box>
          <Box width="100%">
            {items.map((item) => {
              return <ItemCard itemPath={itemPath} key={item.id} item={item} />;
            })}
          </Box>
        </Box>
      </Box>
      {error && (
        <Text color="text.secondary" mb="0.5rem" display="flex" justifyContent="center">
          {error}
        </Text>
      )}

      <Box display="flex" justifyContent="center" alignItems="center" mb="1rem">
        {page !== 1 && (
          <Button mx="0.5rem" onClick={() => paginate('prev')}>
            Previous
          </Button>
        )}
        <Box display="flex">
          {pageRange.map((p) => {
            return (
              <Text
                mx="0.25rem"
                fontWeight={page === p ? 'bold' : 'normal'}
                color="purple.primary"
                key={nanoid()}
              >
                {p}
              </Text>
            );
          })}
        </Box>
        {hasNext && (
          <Button mx="0.5rem" onClick={() => paginate('next')}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Inventory;
