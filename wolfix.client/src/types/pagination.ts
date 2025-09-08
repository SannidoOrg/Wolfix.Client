export interface PaginationDto<T> {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    items: T[];
}