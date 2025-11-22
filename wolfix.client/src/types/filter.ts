export interface AttributeValueDto {
    attributeId: string;
    key: string;
    values: string[];
}

export interface FilterRequestDto {
    categoryId: string;
    filtrationAttribute: {
        attributeId: string;
        key: string;
        value: string;
    }[];
    pageSize?: number;
}