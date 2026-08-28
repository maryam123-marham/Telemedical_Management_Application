require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { clientOrigin } = require('./config');
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const recordRoutes = require('./routes/records');

const app = express();
app.use(helmet());
app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('tiny'));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'telemed-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'A record with that value already exists' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: err.message });
  console.error(err);
  return res.status(500).json({ message: 'Internal server error' });
});
module.exports = app;
