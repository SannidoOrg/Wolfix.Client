// src/types/auth.ts

export interface User {
    userId: string;
    email: string;
    role: string;
    // Разрешаем любые другие поля, которые придут в токене
    [key: string]: any;
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

export interface RegisterDto {
    email: string;
    password: string;
}