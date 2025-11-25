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

// Новый enum согласно изменениям на бэкенде (0 - Preparing, 1 - Sent/Delivered)
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
    // Добавлено поле статуса доставки
    deliveryStatus: OrderDeliveryStatus;
    deliveryInfo: DeliveryInfo;
    deliveryMethodName?: string;
    price: number;
    createdAt: string; // date-time
}

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