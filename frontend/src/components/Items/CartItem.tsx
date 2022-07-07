import { Box, Button, Image, Select, Text } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useState, useContext } from 'react';
import { CartContext } from '../../context/cart';
import { ICart, ICartContext } from '../../interfaces';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
interface ICartItemProps {
  item: ICart;
}

const CartItem = ({ item }: ICartItemProps) => {
  const { deleteCartItem, updateCartItemQuantity, setGrandTotal } = useContext(
    CartContext
  ) as ICartContext;
  const selectOptions = Array.from(Array(item.quantity), (val, key) => key + 1);
  const [quantity, setQuantity] = useState(item.quantity);

  const deleteItemFromCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      const response = await http.delete(`carts/${item.id}/`);
      setGrandTotal(response.data.grand_total);

      deleteCartItem(item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) return;
    }
  };

  const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      if (e.target.value.toLowerCase() === '') return;
      setQuantity(parseInt(e.target.value));
      updateCartItemQuantity(item, parseInt(e.target.value));

      const response = await http.patch(`/carts/${item.id}/`, {
        quantity: parseInt(e.target.value),
      });
      setGrandTotal(response.data.grand_total);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        return;
      }
    }
  };
  return (
    <>
      <Box
        py="0.25rem"
        borderBottom="1px solid #EAEDED"
        display="flex"
        flexDir={['column', 'column', 'row']}
        justifyContent="space-between"
      >
        <Box display="flex">
          <Box width="200px" height="200px">
            <Image width="100%" height="100%" src={item.item.product_url} />
          </Box>
          <Box display="flex" flexDir="column">
            <Text fontSize="1.1rem" color="text.secondary">
              {item.item.name} {item.item.size}
            </Text>
            <Box mt="4rem" display="flex">
              <Select value={quantity} onChange={handleSelect} placeholder="Qty">
                {selectOptions.map((item) => {
                  return (
                    <option key={nanoid()} value={item}>
                      {item}
                    </option>
                  );
                })}
              </Select>

              <Box mx="1rem">
                <Button onClick={deleteItemFromCart}>Delete</Button>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box>
          <Text fontWeight="bold" mb="1rem" textAlign="right" color="text.secondary">
            {item.item.discount === 0
              ? '$' + item.item.price
              : '$' +
                (
                  parseFloat(item.item.price) -
                  (parseFloat(item.item.price) / 100) * item.item.discount
                ).toFixed(2)}
          </Text>
          {item.quantity > 1 && (
            <Box color="text.secondary">
              ({item.quantity}) items{' '}
              <Box as="span" fontWeight="bold">
                ${item.total}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CartItem;
