export interface Address {
  city: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
}

export interface User {
  userId: string;
  profileId: string;
  accountId: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  phoneNumber: string | null;
  birthDate: string | null;
  address: Address | null;
}

export interface RegisterDto {
    email: string;
    password: string;
}

export interface RegisterSellerDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNumber: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber?: string;
    birthDate: string;
    document?: File;
}

export interface ChangeAddressDto {
    address: Address;
}

export interface ChangeBirthDateDto {
    birthDate: string;
}

export interface ChangePhoneNumberDto {
    phoneNumber: string;
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