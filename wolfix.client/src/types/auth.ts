export interface User {
    userId: string;      // Alias для accountId (для совместимости)
    accountId: string;   // ID аккаунта (Identity)
    customerId?: string; // ID профиля покупателя (из поля profile_id)
    email: string;
    role: string;
    [key: string]: any;  // Для доступа к сырым полям токена
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

export interface GoogleLoginDto {
    idToken: string;
}