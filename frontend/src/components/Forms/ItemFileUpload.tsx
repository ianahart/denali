import { useContext, useState } from 'react';
import { Box, Text, Image, Input } from '@chakra-ui/react';
import { ItemFormContext } from '../../context/itemForm';
import { IItemFormContext } from '../../interfaces';

const ItemFileUpload = () => {
  const { base64, setBase64, file, setFile } = useContext(
    ItemFormContext
  ) as IItemFormContext;
  const [error, setError] = useState('');

  const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    readFile(e.dataTransfer.files[0]);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const file: File = e.target.files[0];
    readFile(file);
  };

  const readFile = (file: File) => {
    setError('');
    if (file.size > 1500000) {
      setError('Photo must be under 1.5MB.');
    }

    const fileReader = new FileReader();

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const url = e.target?.result as string;
      setBase64(url);
      setFile(file);
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <Box mt="3rem">
      <Text mb="0.3rem" color="text.primary">
        Upload product photo
      </Text>
      {error && (
        <Text fontSize="0.85rem" color="text.primary">
          {error}
        </Text>
      )}
      <Box
        onDrop={handleOnDrop}
        position="relative"
        border="1px solid #cbd5e0"
        borderRadius="10px"
        height="150px"
        pt="3rem"
        width="150px"
      >
        {base64 && !error && (
          <Image
            src={base64}
            position="absolute"
            top="0"
            left="0"
            borderRadius="10px"
            height="100%"
            width="100%"
          />
        )}

        <Input
          onChange={handleOnChange}
          position="absolute"
          zIndex="3"
          top="0"
          cursor="pointer"
          opacity="0"
          left="0"
          width="100%"
          height="100%"
          type="file"
        />
      </Box>
    </Box>
  );
};
export default ItemFileUpload;
