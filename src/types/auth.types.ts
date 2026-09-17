export interface User {
  id: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff';
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  email: string;
  password?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}
