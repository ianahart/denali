import { retreiveTokens } from './utils';

export const adminItemState = {
  price: '',
  id: 0,
  size: '',
  description: '',
  product_url: '',
  quantity: 0,
  name: '',
  discount: 0,
  discount_price: '',
};

export const billingDetailsState = {
  first_name: { name: 'first_name', value: '', error: '', type: 'text', required: true },
  last_name: { name: 'last_name', value: '', error: '', type: 'text', required: true },
  company: { name: 'company', value: '', error: '', type: 'text', required: false },
  country: {
    name: 'country',
    value: 'United States',
    error: '',
    type: 'text',
    required: true,
  },
  street_address: {
    name: 'street_address',
    value: '',
    error: '',
    type: 'text',
    required: true,
  },
  street_address_2: {
    name: 'street_address_2',
    value: '',
    error: '',
    type: 'text',
    required: false,
  },
  city: { name: 'city', value: '', error: '', type: 'text', required: true },
  state: { name: 'state', value: '', error: '', type: 'text', required: true },
  zip: { name: 'zip', value: '', error: '', type: 'text', required: true },
  phone: { name: 'phone', value: '', error: '', type: 'text', required: true },
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
