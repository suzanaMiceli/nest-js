export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  active: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  last_login?: Date | null;
}
