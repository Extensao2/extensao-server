import { Request, Response, NextFunction } from 'express';
import { JWTUtils } from '@/utils/jwt';
import { UserModel } from '@/models/User';
import { AppError } from '@/middleware/errorHandler';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;

      // Verify OAuth token
      const oauthPayload = JWTUtils.verifyOAuthToken(token);

      // Find or create user
      let user = await UserModel.findOne({
        email: oauthPayload.email
      });

      if (!user) {
        user = new UserModel({
          email: oauthPayload.email,
          name: oauthPayload.name || oauthPayload.email.split('@')[0],
          oauthProvider: oauthPayload.iss,
          oauthId: oauthPayload.sub,
          role: 'user'
        });
        await user.save();
      }

      // Generate internal JWT
      const internalToken = JWTUtils.generateToken({
        sub: user.id,
        email: user.email,
        name: user.name,
        iss: 'sistema-aprendizagem',
        aud: 'api-users'
      });

      res.status(200).json({
        message: 'Login realizado com sucesso',
        userId: user.id,
        token: internalToken
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('OAuth')) {
        next(new AppError('Token OAuth inválido', 401));
      } else {
        next(error);
      }
    }
  }
}