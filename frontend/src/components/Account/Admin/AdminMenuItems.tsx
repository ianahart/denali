import { Box, Heading, UnorderedList, ListItem } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Logout from '../../Mixed/Logout';
const AdminMenuItems = () => {
  return (
    <Box p="0.5rem">
      <Heading textAlign="center" mt="1.5rem" color="text.primary" fontSize="20px">
        Admin Panel
      </Heading>
      <Box
        width="150px"
        margin="0.3rem auto 0 auto"
        height="4px"
        bg="purple.primary"
      ></Box>
      <UnorderedList
        textAlign="left"
        p="0"
        mt="1.5rem"
        display="flex"
        flexDir="column"
        justifyContent="center"
        listStyleType="none"
      >
        <ListItem color="text.primary">
          <RouterLink color="text.primary" to="/admin/add-item">
            Add Item
          </RouterLink>
        </ListItem>
        <ListItem color="text.primary">
          <RouterLink color="text.primary" to="/admin/inventory">
            Inventory
          </RouterLink>
        </ListItem>

        <Logout />
      </UnorderedList>
    </Box>
  );
};

export default AdminMenuItems;
