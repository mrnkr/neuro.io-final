export interface User {
  _id: string;
  email: string;
  name: string;
  last: string;
  password: string;
  admin: boolean;
  active: boolean;
  verified: boolean;
}
