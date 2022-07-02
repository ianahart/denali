import { createContext, useState } from 'react';
import { IItemForm, IItemFormContext } from '../interfaces';
import { itemFormState } from '../helpers/initialState';
interface IChildren {
  children: React.ReactNode;
}

export const ItemFormContext = createContext<IItemFormContext | null>(null);

const ItemFormContextProvider = ({ children }: IChildren) => {
  const [form, setForm] = useState(itemFormState);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');

  const handleUpdateForm = (name: string, value: string, key: string) => {
    setForm((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name as keyof IItemForm], [key]: value },
    }));
  };

  const clearForm = () => {
    setForm(itemFormState);
    setBase64('');
    setFile(null);
  };

  const getFormValues = (form: IItemForm, userId: number | null) => {
    const formValues: { [key: string]: any } = {};
    for (const [key, obj] of Object.entries(form)) {
      formValues[key] = obj.value;
    }
    if (userId !== null) {
      formValues['user'] = userId;
    }
    const formData = new FormData();
    if (file) {
      formData.append('file', file ?? '');
    }
    formData.append('form', JSON.stringify(formValues));

    return formData;
  };

  return (
    <ItemFormContext.Provider
      value={{
        file,
        setFile,
        base64,
        getFormValues,
        setBase64,
        clearForm,
        form,
        setForm,
        handleUpdateForm,
      }}
    >
      {children}
    </ItemFormContext.Provider>
  );
};

export default ItemFormContextProvider;
