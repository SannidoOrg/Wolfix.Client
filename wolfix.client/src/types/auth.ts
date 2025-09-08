export interface User {
  userId: string;
  email: string;
  role: string;
}

export interface RoleRequestDto {
  email: string;
  password: string;
}

export interface TokenRequestDto {
  email: string;
  role: string;
}

export interface RegisterDto {
  email: string;
  password: string;
}