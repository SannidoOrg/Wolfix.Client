// src/types/customer.ts

export interface AddressDto {
    city: string | null;
    street: string | null;
    houseNumber: number | null;
    apartmentNumber: number | null;
}

export interface FullNameDto {
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
}

export interface CustomerDto {
    id: string;
    photoUrl: string | null;
    fullName: FullNameDto;
    phoneNumber: string | null;
    address: AddressDto | null;
    birthDate: string | null; // Date string
    bonusesAmount: number;
}