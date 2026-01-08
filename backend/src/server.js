import express from 'express';
import cors from 'cors';

import listRoutes from './routes/lists.js';
import cardRoutes from './routes/cards.js';

console.log("SERVER FILE LOADED");


const app = express();
const PORT = process.env.PORT || 5000;

console.log("ROUTES ABOUT TO LOAD");


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lists', listRoutes);
app.use('/api/cards', cardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;

