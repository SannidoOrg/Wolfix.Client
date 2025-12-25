import api from "@/lib/api";

// DTO Interfaces based on Swagger
export interface FullNameDto {
    firstName: string;
    lastName: string;
    middleName: string;
}

export interface AddressDto {
    city: string;
    street: string;
    houseNumber: number;
    apartmentNumber?: number | null;
}

export interface SellerProfileDto {
    id: string;
    photoUrl?: string;
    fullName: FullNameDto;
    phoneNumber?: string;
    address?: AddressDto;
    birthDate?: string; // ISO Date "yyyy-MM-dd"
}

// Service Functions
export const getSellerProfile = async (sellerId: string): Promise<SellerProfileDto> => {
    const response = await api.get(`/api/sellers/${sellerId}`);
    return response.data;
};

export const changeSellerFullName = async (sellerId: string, data: FullNameDto) => {
    return await api.patch(`/api/sellers/${sellerId}/full-name`, data);
};

export const changeSellerPhoneNumber = async (sellerId: string, phoneNumber: string) => {
    // Swagger expects { phoneNumber: "..." } body
    return await api.patch(`/api/sellers/${sellerId}/phone-number`, { phoneNumber });
};

export const changeSellerAddress = async (sellerId: string, data: AddressDto) => {
    return await api.patch(`/api/sellers/${sellerId}/address`, data);
};

export const changeSellerBirthDate = async (sellerId: string, birthDate: string) => {
    // Swagger expects { birthDate: "..." } body
    return await api.patch(`/api/sellers/${sellerId}/birth-date`, { birthDate });
};