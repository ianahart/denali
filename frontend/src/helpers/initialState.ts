import { retreiveTokens } from './utils';

export const adminItemState = {
  price: '',
  id: 0,
  size: '',
  description: '',
  product_url: '',
  quantity: 0,
  name: '',
};

export const createAccountState = {
  first_name: { name: 'first_name', value: '', error: '' },
  last_name: { name: 'last_name', value: '', error: '' },
  email: { name: 'email', value: '', error: '' },
  password: { name: 'password', value: '', error: '', type: 'password' },
  confirm_password: { name: 'confirm_password', value: '', error: '', type: 'password' },
};

export const loginAccountState = {
  email: { name: 'email', value: '', error: '' },
  password: { name: 'password', value: '', error: '', type: 'password' },
};

export const itemFormState = {
  name: { name: 'name', error: '', value: '' },
  price: { name: 'price', error: '', value: '' },
  size: { name: 'size', error: '', value: '' },
  quantity: { name: 'quantity', error: '', value: '0' },
  description: { name: 'description', error: '', value: '' },
};

export const userState = {
  id: null,
  is_superuser: false,
  first_name: '',
  last_name: '',
  email: '',
  logged_in: false,
};

const tokens = retreiveTokens();
export const tokenState = {
  access_token: tokens?.access_token ? tokens.access_token : '',
  refresh_token: tokens?.refresh_token ? tokens.refresh_token : '',
};
