"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const jwt_1 = require("@/utils/jwt");
const User_1 = require("@/models/User");
const errorHandler_1 = require("@/middleware/errorHandler");
class AuthController {
    static async login(req, res, next) {
        try {
            const { token } = req.body;
            // Verify OAuth token
            const oauthPayload = jwt_1.JWTUtils.verifyOAuthToken(token);
            // Find or create user
            let user = await User_1.UserModel.findOne({
                email: oauthPayload.email
            });
            if (!user) {
                user = new User_1.UserModel({
                    email: oauthPayload.email,
                    name: oauthPayload.name || oauthPayload.email.split('@')[0],
                    oauthProvider: oauthPayload.iss,
                    oauthId: oauthPayload.sub,
                    role: 'user'
                });
                await user.save();
            }
            // Generate internal JWT
            const internalToken = jwt_1.JWTUtils.generateToken({
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
        }
        catch (error) {
            if (error instanceof Error && error.message.includes('OAuth')) {
                next(new errorHandler_1.AppError('Token OAuth inválido', 401));
            }
            else {
                next(error);
            }
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map