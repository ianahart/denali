import {
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  FormLabel,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';

import { useState } from 'react';
import { http } from '../../../helpers/utils';

interface CheckItemModalProps {
  overlay: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}
const CheckItemModal = ({ overlay, isOpen, closeModal }: CheckItemModalProps) => {
  const [item, setItem] = useState({});
  const [inputValue, setInputValue] = useState('');
  const handleOnClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
  };

  const searchItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      if (!inputValue) return;

      const response = await http.post('/admin/items/search/', inputValue);
      console.log(response);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={closeModal}>
      {overlay}
      <ModalContent>
        <ModalHeader color="text.secondary">Check for Item</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel color="text.secondary">Lookup Item:</FormLabel>
            <Box display="flex">
              <Input
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Name of item..."
                value={inputValue}
                type="text"
              />
              <Button onClick={searchItem} ml="1rem">
                Search
              </Button>
            </Box>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={handleOnClose}
            bg="purple.primary"
            color="#FFF"
            _hover={{ background: 'purple.primary' }}
            _active={{ background: 'purple.primary' }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CheckItemModal;
