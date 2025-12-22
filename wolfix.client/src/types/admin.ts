// src/types/admin.ts

export interface FullNameDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
}

export interface PhoneNumberDto {
    value?: string;
}

export interface AddressDto {
    city?: string;
    street?: string;
    houseNumber?: number;
    apartmentNumber?: number;
}

export interface BirthDateDto {
    value?: string;
}

export interface SellerProfileDataDto {
    fullName?: FullNameDto;
    phoneNumber?: PhoneNumberDto;
    address?: AddressDto;
    birthDate?: BirthDateDto;
}

export interface SellerApplicationDto {
    id: string;
    categoryName?: string;
    documentUrl?: string;
    sellerProfileData?: SellerProfileDataDto;
}