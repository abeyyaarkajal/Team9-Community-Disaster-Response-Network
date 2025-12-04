const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

router.post('/', async (req, res) => {
    try {
        const { type, description, location, severity, reportedBy, isSOS } = req.body;

        const incident = new Incident({
            type,
            description,
            location,
            severity,
            reportedBy,
            isSOS: isSOS || false
        });

        await incident.save();

        res.status(201).json({
            message: 'Incident reported successfully',
            incident
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const { status, severity, type } = req.query;

        let filter = {};
        if (status) filter.status = status;
        if (severity) filter.severity = severity;
        if (type) filter.type = type;

        const incidents = await Incident.find(filter)
            .populate('reportedBy', 'name phone')
            .populate('assignedTo', 'name phone')
            .sort({ createdAt: -1 });

        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single incident
router.get('/:id', async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id)
            .populate('reportedBy', 'name phone email')
            .populate('assignedTo', 'name phone skills');

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id/assign', async (req, res) => {
    try {
        const { volunteerId } = req.body;

        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            {
                assignedTo: volunteerId,
                status: 'assigned',
                updatedAt: Date.now()
            },
            { new: true }
        ).populate('assignedTo', 'name phone skills');

        res.json({
            message: 'Incident assigned successfully',
            incident
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        const incident = await Incident.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        res.json({
            message: 'Status updated successfully',
            incident
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Incident.findByIdAndDelete(req.params.id);
        res.json({ message: 'Incident deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
