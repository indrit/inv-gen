import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import crmRoutes from './routes/crm';
import cmsRoutes from './routes/cms';
import emailRoutes from './routes/email';
import stripeRoutes from './routes/stripe';
import { errorHandler } from './middleware/error-handler';

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));

// Webhook route needs raw body, so we register it BEFORE express.json()
app.use('/api/stripe', stripeRoutes);

app.use(express.json());

// Routes
app.use('/api/crm', crmRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/email', emailRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorHandler);

export default app;
