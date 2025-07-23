"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("@/utils/database");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Attempt to connect to database
        const database = database_1.Database.getInstance();
        await database.connect();
        if (!database.getConnectionStatus()) {
            console.log('⚠️  Server starting without database connection');
            console.log('⚠️  Some features may not work properly');
        }
        // Start server regardless of database connection status
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 Health check: http://localhost:${PORT}/health`);
            console.log(`📚 API Base URL: http://localhost:${PORT}/api/v1`);
            if (database.getConnectionStatus()) {
                console.log('✅ Database: Connected');
            }
            else {
                console.log('❌ Database: Not connected');
            }
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            console.log('🔥 SIGTERM received, shutting down gracefully');
            await database.disconnect();
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            console.log('🔥 SIGINT received, shutting down gracefully');
            await database.disconnect();
            process.exit(0);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map