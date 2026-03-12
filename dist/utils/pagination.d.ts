export interface PaginationParams {
    page?: number;
    limit?: number;
}
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare const getPaginationParams: (page?: string | number, limit?: string | number) => {
    skip: number;
    take: number;
    page: number;
    limit: number;
};
export declare const createPaginatedResponse: <T>(data: T[], total: number, page: number, limit: number) => PaginatedResponse<T>;
//# sourceMappingURL=pagination.d.ts.map