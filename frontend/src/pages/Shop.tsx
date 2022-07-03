import Inventory from '../components/Items/Inventory';

const Shop = () => {
  return <Inventory endpoint="/items" itemPath="/items" />;
};

export default Shop;
