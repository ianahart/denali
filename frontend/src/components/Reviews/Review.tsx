import { Box, Text } from '@chakra-ui/react';
import { BiUserCircle } from 'react-icons/bi';
import { useState } from 'react';
import { IReview } from '../../interfaces';
import { AiFillStar } from 'react-icons/ai';

interface IReviewProps {
  review: IReview;
}

const Review = ({ review }: IReviewProps) => {
  const [stars, setStars] = useState([1, 2, 3, 4, 5]);
  return (
    <Box my="1.5rem">
      <Box alignItems="center" display="flex">
        <BiUserCircle color="gray" fontSize="2rem" />
        <Text ml="0.5rem" color="gray.500">
          {review.first_name} {review.last_name}
        </Text>
      </Box>
      <Box display="flex" mt="0.5rem" alignItems="center">
        {stars.map((_, index) => {
          return (
            <AiFillStar
              key={index}
              className={index < review.rating ? 'on' : 'off'}
              fontSize="1.1rem"
            />
          );
        })}
      </Box>
      <Text mb="0.25rem" textAlign="right" color="gray.400">
        {review.created_at}
      </Text>
      <Text
        color="text.secondary"
        p="0.25rem"
        borderRadius="lg"
        bg="#f7f7fd"
        width={['100%', '100%', '500px']}
      >
        {review.text}
      </Text>
    </Box>
  );
};

export default Review;
