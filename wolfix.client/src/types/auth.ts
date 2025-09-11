export interface Address {
  city: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
}

export interface User {
  userId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  phoneNumber: string | null;
  birthDate: string | null;
  address: Address | null;
}

export interface ChangeFullNameDto {
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
  password: string;
  role: string;
}