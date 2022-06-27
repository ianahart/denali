import { retreiveTokens } from './utils';

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
