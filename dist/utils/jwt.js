"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTUtils {
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secret);
        }
        catch (error) {
            throw new Error('Token inválido');
        }
    }
    static verifyOAuthToken(token) {
        try {
            // Verify OAuth token without secret verification for external tokens
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.sub || !decoded.email) {
                throw new Error('Token OAuth inválido');
            }
            // Verify token hasn't expired
            const now = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < now) {
                throw new Error('Token OAuth expirado');
            }
            return decoded;
        }
        catch (error) {
            throw new Error('Token OAuth inválido');
        }
    }
}
exports.JWTUtils = JWTUtils;
JWTUtils.secret = process.env.JWT_SECRET || 'fallback-secret';
JWTUtils.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
//# sourceMappingURL=jwt.js.map