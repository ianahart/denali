export interface ICreateForm {
  first_name: { name: string; value: string; error: string };
  last_name: { name: string; value: string; error: string };
  email: { name: string; value: string; error: string };
  password: { name: string; value: string; error: string };
  confirm_password: { name: string; value: string; error: string };
}
