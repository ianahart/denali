import { Box, Heading, ListItem, UnorderedList, Text } from '@chakra-ui/react';
import Logout from '../Mixed/Logout';

const UserMenuItems = () => {
  return (
    <Box>
      <Box p="0.5rem">
        <Heading textAlign="center" mt="1.5rem" color="text.primary" fontSize="20px">
          Your Account
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
          display="flex"
          flexDir="column"
          justifyContent="center"
          listStyleType="none"
        >
          <Logout />
        </UnorderedList>
      </Box>
    </Box>
  );
};

export default UserMenuItems;
