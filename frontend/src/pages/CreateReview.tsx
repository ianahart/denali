import {
  Box,
  Button,
  Heading,
  Image,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { useEffectOnce } from '../hooks/UseEffectOnce';
import { BiEdit } from 'react-icons/bi';
import { IItem, IItemResponse, IUserContext } from '../interfaces';
import { adminItemState } from '../helpers/initialState';
import { AiFillStar } from 'react-icons/ai';
import { http } from '../helpers/utils';
import { UserContext } from '../context/user';
const CreateReview = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stars, setStars] = useState([1, 2, 3, 4, 5]);
  const [resize, setResize] = useState('horizontal');
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [item, setItem] = useState<IItem>(adminItemState);
  const [error, setError] = useState('');

  const getItem = async () => {
    try {
      const response = await http.get<IItemResponse>(`/items/${searchParams.get('id')}/`);
      setItem(response.data.item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 404) {
          navigate('/notfound');
        }
      }
    }
  };

  useEffectOnce(() => {
    getItem();
  });

  const handleOnMouseLeave = (index: number) => {
    setRating(index);
  };

  const handleOnMouseEnter = (index: number) => {
    setRating(index);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const cancelReview = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(-1);
  };

  const postReview = async () => {
    try {
      const response = await http.post('/reviews/', {
        user: user.id,
        item: searchParams.get('id'),
        rating,
        text,
      });
      navigate(-1);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
        if (err.response.status === 400) {
          setError(err.response.data.text[0]);
        }
      }
    }
  };

  return (
    <Box bg="#e1dddd" minH="100vh">
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        minH="80vh"
      >
        <Box
          borderRadius="md"
          bg="#FFF"
          boxShadow="md"
          minH="400px"
          width={['95%', '95%', '600px']}
        >
          <Box
            padding="0.25rem"
            display="flex"
            alignItems="center"
            bg="purple.primary"
            borderTopRadius="md"
            width="100%"
          >
            <Box>
              <BiEdit fontSize="2rem" color="#FFF" />
            </Box>
            <Box ml="3rem">
              <Heading mb="0.25rem" fontSize="1.5rem" color="#fFF">
                Rate & review
              </Heading>
              <Box alignItems="center" display="flex">
                <Image
                  borderRadius="md"
                  width="60px"
                  height="60px"
                  src={item.product_url}
                />
                <Text ml="1.5rem" color="#fFF">
                  {item.name} {item.size}
                </Text>
              </Box>
            </Box>
          </Box>

          <Box p="0.5rem">
            <Text color="text.secondary">
              Your review will be posted publicy on the web.
            </Text>
            <Box display="flex">
              {stars.map((star, index) => {
                index += 1;
                return (
                  <Box cursor="pointer" key={index}>
                    <AiFillStar
                      className={index <= rating ? 'on' : 'off'}
                      onMouseLeave={() => handleOnMouseLeave(index)}
                      onMouseEnter={() => handleOnMouseEnter(index)}
                      fontSize="1.5rem"
                    />
                  </Box>
                );
              })}
            </Box>

            <Box my="1.5rem">
              <RadioGroup defaultValue={resize} onChange={setResize} mb={6}>
                <Stack direction="row" spacing={5}>
                  <Radio value="horizontal">Horizontal</Radio>
                  <Radio value="vertical">Vertical</Radio>
                  <Radio value="none">None</Radio>
                </Stack>
              </RadioGroup>

              {error && (
                <Text mt="2rem" fontSize="0.85rem" color="red">
                  {error}
                </Text>
              )}

              <Textarea
                onChange={handleOnChange}
                placeholder="Write review"
                size="sm"
                //@ts-ignore
                resize={resize}
              />
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={cancelReview} mx="1rem" color="text.secondary">
                Cancel
              </Button>
              <Button onClick={postReview} mx="1rem" color="text.secondary">
                Post
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateReview;
