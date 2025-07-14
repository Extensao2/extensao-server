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
      console.log('Already connected to MongoDB');
      return;
    }

    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sistema-aprendizagem';
      
      console.log('Attempting to connect to MongoDB...');
      console.log('MongoDB URI:', mongoUri);
      
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });

      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');

      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      console.log('💡 Make sure MongoDB is running on your system');
      console.log('💡 You can start MongoDB with: mongod');
      console.log('💡 Or use a cloud MongoDB service like MongoDB Atlas');
      
      // Don't throw the error, just log it and continue
      // This allows the server to start even without MongoDB
      this.isConnected = false;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}