"use strict";
// src/utils/pagination.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.getPaginationParams = void 0;
const getPaginationParams = (page, limit) => {
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 10));
    return {
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        page: pageNum,
        limit: limitNum,
    };
};
exports.getPaginationParams = getPaginationParams;
const createPaginatedResponse = (data, total, page, limit) => {
    const totalPages = Math.ceil(total / limit);
    return {
        data,
        meta: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        },
    };
};
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=pagination.js.map