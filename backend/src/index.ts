import express from 'express';
import cors from 'cors';
import { onboardingRoutes } from './controllers/api/onboardingController';
import { adminOnboardingRoutes } from './controllers/api/admin/onboardingController';
import { mcpOnboardingRoutes } from './controllers/api/mcp/onboardingController';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/admin/onboarding', adminOnboardingRoutes);
app.use('/api/mcp/onboarding', mcpOnboardingRoutes);

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Onboarding Context Registry API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
