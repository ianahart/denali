import { useContext, useState } from 'react';
import { Box, Text, Button, Select } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { IDeliveryDate, IItem, IUserContext } from '../../interfaces';
import { UserContext } from '../../context/user';
import { nanoid } from 'nanoid';

interface IItemActionsProps {
  item: IItem;
  deliveryDate: IDeliveryDate;
}

const ItemActions = ({ item, deliveryDate }: IItemActionsProps) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0);
  const selectOptions = Array.from(Array(item.quantity), (val, key) => key + 1);
  const { user } = useContext(UserContext) as IUserContext;

  const addItemToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user.logged_in) {
      navigate('/login');
    }
  };

  const buyItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user.logged_in) {
      navigate('/login');
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  return (
    <Box p="0.5rem" textAlign="center" margin=" 0 auto" mt="10rem">
      <Text color="text.secondary">
        Order within{' '}
        <Box as="span" color="green" fontWeight="bold">
          {deliveryDate.remaining_hrs} hrs
        </Box>{' '}
        and receive it by{' '}
        <Box as="span" fontWeight="bold">
          {deliveryDate.day}, {deliveryDate.one_week_date}
        </Box>
      </Text>
      {item.quantity > 0 ? (
        <Box>
          <Text textAlign="left" color="green" fontSize="1.2rem">
            In Stock
          </Text>

          <Select value={quantity} onChange={handleSelect} placeholder="Qty">
            {selectOptions.map((item) => {
              return (
                <option key={nanoid()} value={item}>
                  {item}
                </option>
              );
            })}
          </Select>
        </Box>
      ) : (
        <Text textAlign="left" color="red">
          Out of Stock
        </Text>
      )}

      <Box m="3rem auto 1rem auto" alignItems="center" display="flex" flexDir="column">
        <Button onClick={addItemToCart} variant="main" bg="blue.primary" my="0.5rem">
          Add to Cart
        </Button>
        <Button onClick={buyItem} variant="main" my="0.5rem">
          Buy Now
        </Button>
      </Box>
    </Box>
  );
};
export default ItemActions;
