import { createContext, useState } from 'react';
import { ICartContext, ICart } from '../interfaces';
interface IChildren {
  children: React.ReactNode;
}

export const CartContext = createContext<ICartContext | null>(null);

const CartContextProvider = ({ children }: IChildren) => {
  const [cart, setCart] = useState<ICart[]>([]);
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  const updateCartItemQuantity = (item: ICart, newQuantity: number) => {
    const updatedCart = cart.map((cartItem) => {
      if (cartItem.id === item.id) {
        const total = newQuantity * cartItem.price;
        return { ...cartItem, quantity: newQuantity, total };
      } else {
        return cartItem;
      }
    });
    setCart(updatedCart);
  };

  const deleteCartItem = (cartItem: ICart) => {
    setCart((prevState) => prevState.filter((item) => item.id !== cartItem.id));
  };

  return (
    <CartContext.Provider
      value={{
        deleteCartItem,
        setTotalCartItems,
        updateCartItemQuantity,
        grandTotal,
        setGrandTotal,
        totalCartItems,
        cart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
