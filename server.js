console.log('Server file is loading...');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('Middleware configured');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
    });

// Import Routes
console.log('📦 Loading routes...');
const authRoutes = require('./routes/auth');
console.log('✅ Auth routes loaded:', typeof authRoutes);

const incidentRoutes = require('./routes/incidents');
console.log('✅ Incident routes loaded:', typeof incidentRoutes);

const alertRoutes = require('./routes/alerts');
console.log('✅ Alert routes loaded:', typeof alertRoutes);

const hazardZoneRoutes = require('./routes/hazardZones');
console.log('✅ Hazard zone routes loaded:', typeof hazardZoneRoutes);

const damageReportRoutes = require('./routes/damageReports');
console.log('✅ Damage report routes loaded:', typeof damageReportRoutes);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/hazard-zones', hazardZoneRoutes);
app.use('/api/damage-reports', damageReportRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Disaster Response Network API is running!',
        mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        endpoints: {
            auth: '/api/auth',
            incidents: '/api/incidents',
            alerts: '/api/alerts',
            hazardZones: '/api/hazard-zones',
            damageReports: '/api/damage-reports'
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
