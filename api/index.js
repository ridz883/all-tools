const express = require('express');
const cors = require('cors');
const apiRoutes = require('../routes/api.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing API
app.use('/api/v1', apiRoutes);

// Endpoint Check
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    message: 'MultiTool.io Vercel Serverless API Running 🚀',
    version: '1.0.0'
  });
});

// Penting untuk Vercel: Export app, BUKAN app.listen()
module.exports = app;
