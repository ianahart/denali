import { Box, Image, Heading } from '@chakra-ui/react';
import notFound from '../images/404.png';

const NotFound = () => {
  return (
    <Box>
      <Box>
        <Heading mt="2rem" color="text.secondary" textAlign="center">
          404 Not Found
        </Heading>
      </Box>
      <Image src={notFound} alt="notfound 404" />
    </Box>
  );
};
export default NotFound;
