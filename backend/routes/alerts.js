const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Create new alert
router.post('/', async (req, res) => {
    try {
        const { type, severity, title, message, affectedAreas, issuedBy, expiresAt } = req.body;

        const alert = new Alert({
            type,
            severity,
            title,
            message,
            affectedAreas,
            issuedBy,
            expiresAt
        });

        await alert.save();

        res.status(201).json({
            message: 'Alert created successfully',
            alert
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all active alerts
router.get('/', async (req, res) => {
    try {
        const alerts = await Alert.find({
            isActive: true,
            $or: [
                { expiresAt: { $gte: new Date() } },
                { expiresAt: null }
            ]
        })
            .populate('issuedBy', 'name role')
            .sort({ createdAt: -1 });

        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single alert
router.get('/:id', async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id)
            .populate('issuedBy', 'name role');

        if (!alert) {
            return res.status(404).json({ message: 'Alert not found' });
        }

        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Deactivate alert
router.put('/:id/deactivate', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        res.json({
            message: 'Alert deactivated',
            alert
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
