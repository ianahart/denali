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
  Text,
} from '@chakra-ui/react';
import { AxiosError } from 'axios';

import { useState } from 'react';
import { adminItemState } from '../../../../helpers/initialState';
import { http } from '../../../../helpers/utils';
import { IAdminSearchResponse } from '../../../../interfaces';
import AdminItem from './AdminItem';

interface CheckItemModalProps {
  overlay: React.ReactNode;
  isOpen: boolean;
  closeModal: () => void;
}
const CheckItemModal = ({ overlay, isOpen, closeModal }: CheckItemModalProps) => {
  const [item, setItem] = useState(adminItemState);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleOnClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    closeModal();
    setItem(adminItemState);
    setInputValue('');
  };

  const searchItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      setError('');
      if (!inputValue) return;

      const response = await http.post<IAdminSearchResponse>('/admin/items/search/', {
        search_term: inputValue,
      });
      setItem(response.data.item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.search_term[0]);
      }
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={closeModal}>
      {overlay}
      <ModalContent>
        <ModalHeader color="text.secondary">Check for Item</ModalHeader>
        {error && (
          <Text fontSize="0.85rem" color="text.primary" mt="1rem">
            {error}
          </Text>
        )}
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
            {item.id !== 0 && (
              <Box display="flex" justifyContent="center" my="1.5rem">
                <AdminItem item={item} />
              </Box>
            )}
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
