import { Box, Image, Text } from '@chakra-ui/react';
import { IItem } from '../../interfaces';
import { Link as RouterLink } from 'react-router-dom';

interface IItemCardProps {
  item: IItem;
  itemPath: string;
}

const ItemCard = ({ item, itemPath }: IItemCardProps) => {
  return (
    <Box my="2rem" display="flex">
      <Box>
        <RouterLink to={`${itemPath}/${item.id}`}>
          <Image
            cursor="pointer"
            boxShadow="sm"
            height="200px"
            width="200px"
            src={item.product_url}
            alt={item.name}
          />
        </RouterLink>
      </Box>
      <Box p="0.5rem" bg="#f8f6f6" boxShadow="sm" width="100%">
        <RouterLink to={`${itemPath}/${item.id}`}>
          <Text
            cursor="pointer"
            _hover={{ color: 'purple.primary' }}
            color="text.secondary"
            fontSize="1.2rem"
            fontWeight="bold"
          >
            {item.name} {item.size}
          </Text>
        </RouterLink>
        <Text display="flex" color="text.primary">
          <Box as="span" fontSize="1.2rem">
            ${item.price.split('.')[0]}
          </Box>

          <Box as="span" fontSize="0.85rem">
            {item.price.split('.')[1] === '00' ? '' : item.price.split('.')[1]}
          </Box>
        </Text>
      </Box>
    </Box>
  );
};

export default ItemCard;
