import { Box, Heading, Text } from '@chakra-ui/react';
import { IItem } from '../../interfaces';

interface ItemDetailsProps {
  item: IItem;
}

const ItemDetails = ({ item }: ItemDetailsProps) => {
  return (
    <Box>
      <Heading pb="0.5rem" borderBottom="1px solid #d5d7d5" as="h2" fontSize="1.5rem">
        {item.name} {item.size}
      </Heading>
      <Box>
        <Text my="0.5rem" fontWeight="bold">
          Price ${item.price}
        </Text>
        <Text my="0.5rem" fontWeight="bold">
          Size {item.size}
        </Text>
        <Text my="0.5rem" fontWeight="bold">
          Qty {item.quantity}
        </Text>
        <Text my="0.5rem" fontWeight="bold">
          About this Item
        </Text>
        <Text width="300px">{item.description}</Text>
      </Box>
    </Box>
  );
};

export default ItemDetails;
