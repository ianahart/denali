import { Box, Text, Image } from '@chakra-ui/react';
import { IItem } from '../../../../interfaces';

interface AdminItemProps {
  item: IItem;
}

const AdminItem = ({ item }: AdminItemProps) => {
  console.log(item);
  return (
    <Box width="150px" height="150px">
      <Image width="150px" height="150px" src={item.product_url} alt="product" />
      <Text textAlign="center" color="text.secondary">
        {item.name}
      </Text>
    </Box>
  );
};

export default AdminItem;
