import mongoose from 'mongoose';

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('MongoDB já está conectado.');
      return;
    }

    try {
      // --- INÍCIO DA CORREÇÃO ---
      // Lê as variáveis de ambiente separadamente.
      const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;

      let mongoUri: string;

      // Verifica se todas as variáveis necessárias para a conexão autenticada existem.
      if (MONGO_USER && MONGO_PASS && MONGO_HOST && MONGO_PORT && MONGO_DB_NAME) {
        // Monta a URI dinamicamente. É aqui que a "mágica" acontece.
        mongoUri = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`;
      } else {
        // Se as variáveis não estiverem definidas, usa uma conexão local padrão sem autenticação.
        console.warn('⚠️ Variáveis de ambiente do MongoDB não definidas. Usando URI padrão não autenticada.');
        mongoUri = 'mongodb://localhost:27017/sistema-aprendizagem';
      }
      // --- FIM DA CORREÇÃO ---

      console.log('Tentando conectar ao MongoDB...');
      // Log da URI com a senha ofuscada para segurança.
      console.log('MongoDB URI:', mongoUri.replace(/:.*@/, ':<password>@'));

      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });

      this.isConnected = true;
      console.log('✅ Conectado ao MongoDB com sucesso!');

      mongoose.connection.on('error', (error) => {
        console.error('❌ Erro na conexão com o MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 Desconectado do MongoDB.');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Falha ao conectar ao MongoDB:', error);
      this.isConnected = false;
      // Permite que o servidor continue rodando mesmo sem a conexão com o banco.
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Desconectado do MongoDB.');
    } catch (error) {
      console.error('Erro ao desconectar do MongoDB:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
