import { Box } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { http } from '../../helpers/utils';
import { adminItemState } from '../../helpers/initialState';
import { IItem, IAdminItemResponse } from '../../interfaces';
import { useEffectOnce } from '../../hooks/UseEffectOnce';
import ItemForm from '../../components/Forms/ItemForm';

const EditItem = () => {
  const { id } = useParams();
  const [item, setItem] = useState<IItem>(adminItemState);

  const fetchItem = async () => {
    try {
      const response = await http.get<IAdminItemResponse>(`/admin/items/${id}/`);
      setItem(response.data.item);
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        if (err.response.status === 404) {
        }
      }
    }
  };

  useEffectOnce(() => {
    fetchItem();
  });

  return (
    <Box padding="0.5rem" minH="100vh" width="100%">
      <ItemForm
        item={item}
        title="Update Item"
        buttonText="Update product"
        action="put"
      />
    </Box>
  );
};

export default EditItem;
