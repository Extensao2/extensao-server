import { JWTPayload } from '@/types';
export declare class JWTUtils {
    private static secret;
    private static expiresIn;
    static generateToken(payload: Partial<JWTPayload>): string;
    static verifyToken(token: string): JWTPayload;
    static verifyOAuthToken(token: string): JWTPayload;
}
//# sourceMappingURL=jwt.d.ts.map