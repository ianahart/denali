import { useParams } from 'react-router-dom';
import { Box } from '@chakra-ui/react';

const SingleItem = () => {
  const { id } = useParams();
  return <Box>{id}</Box>;
};

export default SingleItem;
