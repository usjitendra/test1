const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const responseHandler = require('./utils/responseHandler.utils');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/user', userRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  return responseHandler.errorResponse(
    res,
    err.status || 500,
    err.message || 'Internal Server Error',
    null,
    process.env.NODE_ENV !== 'production' ? err.stack : undefined
  );
});

module.exports = app;