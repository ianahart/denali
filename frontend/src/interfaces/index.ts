export interface ICreateForm {
  first_name: { name: string; value: string; error: string };
  last_name: { name: string; value: string; error: string };
  email: { name: string; value: string; error: string };
  password: { name: string; value: string; error: string; type: string };
  confirm_password: { name: string; value: string; error: string; type: string };
}

export interface ILoginForm {
  email: { name: string; value: string; error: string };
  password: { name: string; value: string; error: string; type: string };
}

export interface IUser {
  id: number | null;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  email: string;
  logged_in: boolean;
}

export interface ISearchItem {
  id: number;
  exerpt: string;
  product_url: string;
  name: string;
}

export interface IDeliveryDate {
  day: string;
  one_week_date: string;
  remaining_hrs: number;
}

export interface ICart {
  id: number;
  item: IItem;
  total: number;
  price: number;
  name: string;
  quantity: number;
}

export interface ICartResponse {
  message?: string;
  cart: ICart[];
  has_next: boolean;
  page: number;
}

export interface ISearchResponse {
  message?: string;
  has_next: boolean;
  page: number;
  items: ISearchItem[];
}

export interface IAdminItemResponse {
  message?: string;
  item: IItem;
}

export interface IItemResponse extends IAdminItemResponse {
  date: {
    one_week_date: string;
    remaining_hrs: number;
    day: string;
  };
}

export interface AdminItemsResponse {
  message?: string;
  has_next: boolean;
  page: number;
  items: IItem[];
  page_range: (string | number)[];
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IItem {
  price: string;
  id: number;
  size: string;
  name: string;
  description: string;
  product_url: string;
  quantity: number;
  discount: number;
  discount_price: string;
}

export interface IAdminSearchResponse {
  message?: string;
  item: IItem;
}

export interface ILoginResponse {
  message?: string;
  user: IUser;
  tokens: ITokens;
}

export interface IItemForm {
  name: { name: string; error: string; value: string };
  price: { name: string; error: string; value: string };
  size: { name: string; error: string; value: string };
  quantity: { name: string; error: string; value: string };
  description: { name: string; error: string; value: string };
}

export interface IUserContext {
  user: IUser;
  tokens: ITokens;
  setUser: (user: IUser) => void;
  stowTokens: (tokens: ITokens) => void;
  setTokens: (tokens: ITokens) => void;
  logout: () => void;
}

export interface IItemFormContext {
  form: IItemForm;
  setForm: (form: IItemForm) => void;
  handleUpdateForm: (name: string, value: string, key: string) => void;
  clearForm: () => void;
  base64: string;
  setBase64: (url: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  getFormValues: (form: IItemForm, userId: number | null) => void;
}

export interface ICartContext {
  cart: ICart[];
  totalCartItems: number;
  grandTotal: number;
  setCart: (cart: ICart[]) => void;
  setTotalCartItems: (total: number) => void;
  setGrandTotal: (grandTotal: number) => void;
  updateCartItemQuantity: (cartItem: ICart, newQuantity: number) => void;
  deleteCartItem: (cartItem: ICart) => void;
}
