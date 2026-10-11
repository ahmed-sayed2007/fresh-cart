export interface UpdateUserPayload {
  name: string;
  email: string;
  phone: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface LoggedInUser {
  name: string;
  email: string;
  phone?: string;
}
