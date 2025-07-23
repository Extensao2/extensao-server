export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    oauthProvider: string;
    oauthId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Resource {
    id: string;
    title: string;
    content: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Event {
    id: string;
    nome: string;
    data: Date;
    descricao: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthenticatedRequest extends Request {
    user?: User;
}
export interface PaginationParams {
    page: number;
    size: number;
}
export interface SearchParams extends PaginationParams {
    title?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}
export interface JWTPayload {
    sub: string;
    email: string;
    name: string;
    iss: string;
    aud: string;
    exp: number;
    iat: number;
}
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}
//# sourceMappingURL=index.d.ts.map