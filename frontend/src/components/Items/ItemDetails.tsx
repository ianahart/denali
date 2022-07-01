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
        <Box display="flex">
          <Box position="relative">
            <Text my="0.5rem" fontWeight="bold">
              Price ${item.price}
            </Text>
            {item.discount > 0 && (
              <Box
                position="absolute"
                right="0"
                top="20px"
                height="2px"
                width="60px"
                bg="text.primary"
                transform="rotate(10deg)"
              ></Box>
            )}
          </Box>
          {item.discount > 0 && (
            <Text color="purple.primary">${item.discount_price}</Text>
          )}
        </Box>
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
