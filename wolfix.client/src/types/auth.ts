export interface User {
  userId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  middleName: string;
}

export interface RoleRequestDto {
  email: string;
  password: string;
}

export interface TokenRequestDto {
  email: string;
  role: string;
}