import 'dotenv/config';
// Environment setup

import { connectDB } from './config/db.config';
import express from 'express';
import cors from 'cors';
import { authenticateJWT, isVendor, isEvaluator, isProcurementManager } from './middleware/jwtAuth';

// Routes
import loginRoute from './routes/login';
import registerRoute from './routes/register';
import tendersRoute from './routes/tenders';
import evaluatorsRoute from './routes/evaluators';
import submissionsRoute from './routes/tenderSubmissions'

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); 
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));

// API Routes
app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/tenders', tendersRoute);
app.use('/api/evaluators', evaluatorsRoute);
app.use('/api/evaluators', evaluatorsRoute);

// Protected routes
app.get('/api/profile', authenticateJWT, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Role-specific routes examples
app.get('/api/vendor/dashboard', authenticateJWT, isVendor, (req, res) => {
  res.json({
    success: true,
    message: 'Vendor dashboard data',
    data: {
      // Vendor specific data...
    }
  });
});

app.get('/api/evaluator/dashboard', authenticateJWT, isEvaluator, (req, res) => {
  res.json({
    success: true,
    message: 'Evaluator dashboard data',
    data: {
      // Evaluator specific data...
    }
  });
});

app.get('/api/manager/dashboard', authenticateJWT, isProcurementManager, (req, res) => {
  res.json({
    success: true,
    message: 'Procurement Manager dashboard data',
    data: {
      // Procurement Manager specific data...
    }
  });
});

app.use('/api/submissions', submissionsRoute);

// Start server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));