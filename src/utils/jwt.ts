import jwt from 'jsonwebtoken';
import { JWTPayload } from '@/types';

export class JWTUtils {
  private static secret = process.env.JWT_SECRET || 'fallback-secret';
  private static expiresIn = process.env.JWT_EXPIRES_IN || '24h';

  static generateToken(payload: Partial<JWTPayload>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.secret) as JWTPayload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  static verifyOAuthToken(token: string): JWTPayload {
    try {
      // Verify OAuth token without secret verification for external tokens
      const decoded = jwt.decode(token) as JWTPayload;
      
      if (!decoded || !decoded.sub || !decoded.email) {
        throw new Error('Token OAuth inválido');
      }

      // Verify token hasn't expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        throw new Error('Token OAuth expirado');
      }

      return decoded;
    } catch (error) {
      throw new Error('Token OAuth inválido');
    }
  }
}