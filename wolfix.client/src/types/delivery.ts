// src/types/delivery.ts

export interface DepartmentDto {
    id: string;
    number: number;
    street: string;
    houseNumber: number;
}

export interface PostMachineDto {
    id: string;
    number: number;
    street: string;
    houseNumber: number;
    note?: string;
}

export interface CityDto {
    id: string;
    name: string;
    departments: DepartmentDto[];
    postMachines: PostMachineDto[];
}

export interface DeliveryMethodDto {
    id: string;
    name: string;
    cities: CityDto[];
}