const express = require('express');
const router = express.Router();
const DamageReport = require('../models/DamageReport');

router.post('/', async (req, res) => {
    try {
        const { reportedBy, damageType, estimatedLoss, description, location, documents, photos } = req.body;
        const damageReport = new DamageReport({
            reportedBy,
            damageType,
            estimatedLoss,
            description,
            location,
            documents,
            photos
        });
        await damageReport.save();
        res.status(201).json({ message: 'Damage report submitted successfully', damageReport });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { status, damageType } = req.query;
        let filter = {};
        if (status) filter.status = status;
        if (damageType) filter.damageType = damageType;
        const damageReports = await DamageReport.find(filter)
            .populate('reportedBy', 'name phone email')
            .populate('verifiedBy', 'name role')
            .sort({ createdAt: -1 });
        res.json(damageReports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const damageReport = await DamageReport.findById(req.params.id)
            .populate('reportedBy', 'name phone email location')
            .populate('verifiedBy', 'name role');
        if (!damageReport) {
            return res.status(404).json({ message: 'Damage report not found' });
        }
        res.json(damageReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status, verifiedBy, compensationAmount } = req.body;
        const updateData = { status, updatedAt: Date.now() };
        if (verifiedBy) updateData.verifiedBy = verifiedBy;
        if (compensationAmount) updateData.compensationAmount = compensationAmount;
        const damageReport = await DamageReport.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Damage report updated successfully', damageReport });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
