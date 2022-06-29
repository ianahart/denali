import { Box, Button } from '@chakra-ui/react';
import { useContext } from 'react';
import ItemForm from '../../components/Forms/ItemForm';
import { ItemFormContext } from '../../context/itemForm';
import { IItemFormContext } from '../../interfaces';
const AddItem = () => {
  const { clearForm } = useContext(ItemFormContext) as IItemFormContext;

  const handleOnClearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    clearForm();
  };

  return (
    <Box display="flex" className="add-item-container" minH="100vh">
      <Box
        minH="100vh"
        width={['100%', '100%', '290px']}
        border="1px solid"
        borderColor="#e7ebe7"
        borderBottom="none"
        padding="0.5rem;"
      >
        <Box display="flex" flexDir="column" alignItems="start">
          <Button
            onClick={handleOnClearForm}
            bg="transparent"
            color="text.primary"
            _hover={{ background: 'transparent', opacity: 0.8 }}
            _active={{ background: 'none' }}
          >
            Clear form
          </Button>

          <Button
            bg="transparent"
            color="text.primary"
            _hover={{ background: 'transparent', opacity: 0.8 }}
            _active={{ background: 'none' }}
          >
            Check for item
          </Button>
        </Box>
      </Box>
      <Box padding="0.5rem" minH="100vh" width="100%">
        <ItemForm title="Add to Inventory" />
      </Box>
    </Box>
  );
};

export default AddItem;
