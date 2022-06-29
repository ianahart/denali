import { Box, Button, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import CheckItemModal from '../../components/Account/Admin/CheckItemModal';
import ItemForm from '../../components/Forms/ItemForm';
import { ItemFormContext } from '../../context/itemForm';
import { IItemFormContext } from '../../interfaces';
const AddItem = () => {
  const { clearForm } = useContext(ItemFormContext) as IItemFormContext;
  const [isOpen, setIsOpen] = useState(false);

  const OverlayOne = () => (
    <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);

  const closeModal = () => setIsOpen(false);

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
            onClick={() => {
              setOverlay(<OverlayOne />);
              setIsOpen(true);
            }}
          >
            Check for item
          </Button>
          <CheckItemModal overlay={overlay} isOpen={isOpen} closeModal={closeModal} />
        </Box>
      </Box>
      <Box padding="0.5rem" minH="100vh" width="100%">
        <ItemForm title="Add to Inventory" />
      </Box>
    </Box>
  );
};

export default AddItem;
