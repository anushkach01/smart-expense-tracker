export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}