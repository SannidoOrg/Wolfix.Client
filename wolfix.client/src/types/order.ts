// src/types/order.ts

export enum DeliveryOption {
    NovaPoshta = 0,
    UkrPoshta = 1,
    Courier = 2
}

export enum OrderPaymentOption {
    Cash = 0,
    Card = 1
}

export enum OrderPaymentStatus {
    Pending = 0,
    Paid = 1,
    Failed = 2
}

export enum OrderDeliveryStatus {
    Preparing = 0,
    Sent = 1
}

export interface DeliveryInfo {
    number?: number;
    city?: string;
    street?: string;
    houseNumber?: number;
    option: DeliveryOption;
}

export interface CustomerOrderDto {
    id: string;
    number?: string;
    paymentOption: OrderPaymentOption;
    paymentStatus: OrderPaymentStatus;
    deliveryStatus: OrderDeliveryStatus;
    deliveryInfo: DeliveryInfo;
    deliveryMethodName?: string;
    price: number;
    createdAt: string;
    productsNames: string[];
}

// --- Новые типы для деталей заказа ---

export interface OrderItemDetailsDto {
    id: string;
    photoUrl?: string;
    title?: string;
    quantity: number;
    price: number;
    productId: string;
}

export interface OrderDetailsDto {
    id: string;
    number?: string;
    recipientFirstName?: string;
    recipientLastName?: string;
    recipientMiddleName?: string;
    recipientPhoneNumber?: string;

    // В Swagger эти поля пришли как string, но для UI удобнее мапить их или отображать как есть
    deliveryStatus?: string;
    paymentOption?: string;
    paymentStatus?: string;

    deliveryNumber?: number;
    deliveryCity?: string;
    deliveryStreet?: string;
    deliveryHouseNumber?: number;
    deliveryMethodName?: string;

    price: number;
    orderItems: OrderItemDetailsDto[];
}

// --- DTO для создания заказа (без изменений) ---

export interface CreateOrderItemDto {
    cartItemId?: string;
    productId: string;
    photoUrl?: string;
    title?: string;
    quantity: number;
    price: number;
}

export interface CreateOrderDto {
    customerFirstName: string;
    customerLastName: string;
    customerMiddleName?: string;
    customerPhoneNumber: string;
    customerEmail: string;
    customerId: string;

    recipientFirstName?: string;
    recipientLastName?: string;
    recipientMiddleName?: string;
    recipientPhoneNumber?: string;

    deliveryMethodName?: string;
    deliveryInfoNumber?: number;
    deliveryInfoCity?: string;
    deliveryInfoStreet?: string;
    deliveryInfoHouseNumber?: number;
    deliveryOption: DeliveryOption;

    withBonuses: boolean;
    usedBonusesAmount: number;
    price: number;
}

export interface PlaceOrderDto {
    order: CreateOrderDto;
    orderItems: CreateOrderItemDto[];
}

export interface OrderPlacedWithPaymentDto {
    clientSecret?: string;
    orderId?: string;
}