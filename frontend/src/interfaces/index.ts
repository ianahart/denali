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

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface ILoginResponse {
  message?: string;
  user: IUser;
  tokens: ITokens;
}

export interface IUserContext {
  user: IUser;
  tokens: ITokens;
  setUser: (user: IUser) => void;
  stowTokens: (tokens: ITokens) => void;
  setTokens: (tokens: ITokens) => void;
  logout: () => void;
}
