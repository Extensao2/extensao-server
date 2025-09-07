"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect() {
        if (this.isConnected) {
            console.log('MongoDB já está conectado.');
            return;
        }
        try {
            // --- INÍCIO DA CORREÇÃO ---
            // Lê as variáveis de ambiente separadamente.
            const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;
            let mongoUri;
            // Verifica se todas as variáveis necessárias para a conexão autenticada existem.
            if (MONGO_USER && MONGO_PASS && MONGO_HOST && MONGO_PORT && MONGO_DB_NAME) {
                // Monta a URI dinamicamente. É aqui que a "mágica" acontece.
                mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;
            }
            else {
                // Se as variáveis não estiverem definidas, usa uma conexão local padrão sem autenticação.
                console.warn('⚠️ Variáveis de ambiente do MongoDB não definidas. Usando URI padrão não autenticada.');
                mongoUri = 'mongodb://localhost:27017/sistema-aprendizagem';
            }
            // --- FIM DA CORREÇÃO ---
            console.log('Tentando conectar ao MongoDB...');
            // Log da URI com a senha ofuscada para segurança.
            console.log('MongoDB URI:', mongoUri.replace(/:.*@/, ':<password>@'));
            await mongoose_1.default.connect(mongoUri, {
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 10000,
            });
            this.isConnected = true;
            console.log('✅ Conectado ao MongoDB com sucesso!');
            mongoose_1.default.connection.on('error', (error) => {
                console.error('❌ Erro na conexão com o MongoDB:', error);
                this.isConnected = false;
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.log('🔌 Desconectado do MongoDB.');
                this.isConnected = false;
            });
        }
        catch (error) {
            console.error('❌ Falha ao conectar ao MongoDB:', error);
            this.isConnected = false;
            // Permite que o servidor continue rodando mesmo sem a conexão com o banco.
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.disconnect();
            this.isConnected = false;
            console.log('Desconectado do MongoDB.');
        }
        catch (error) {
            console.error('Erro ao desconectar do MongoDB:', error);
        }
    }
    getConnectionStatus() {
        return this.isConnected;
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map