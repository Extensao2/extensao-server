import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';

// Routes
import authRoutes from '@/routes/auth';
import resourceRoutes from '@/routes/resources';
import eventRoutes from '@/routes/events';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});
app.use('/api/v1', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '0.1.0'
  });
});

// API routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', resourceRoutes);
app.use('/api/v1', eventRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;