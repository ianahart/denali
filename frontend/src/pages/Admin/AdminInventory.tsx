import Inventory from '../../components/Items/Inventory';
const AdminInventory = () => {
  return <Inventory endpoint="/admin/items" itemPath="/admin/items" />;
};

export default AdminInventory;
