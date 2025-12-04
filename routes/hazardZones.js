const express = require('express');
const router = express.Router();
const HazardZone = require('../models/HazardZone');

router.post('/', async (req, res) => {
  try {
    const { name, type, coordinates, riskLevel, population, safetyMeasures, description } = req.body;
    const hazardZone = new HazardZone({
      name,
      type,
      coordinates,
      riskLevel,
      population,
      safetyMeasures,
      description
    });
    await hazardZone.save();
    res.status(201).json({ message: 'Hazard zone created successfully', hazardZone });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, riskLevel } = req.query;
    let filter = {};
    if (type) filter.type = type;
    if (riskLevel) filter.riskLevel = riskLevel;
    const hazardZones = await HazardZone.find(filter).sort({ riskLevel: -1 });
    res.json(hazardZones);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hazardZone = await HazardZone.findById(req.params.id);
    if (!hazardZone) {
      return res.status(404).json({ message: 'Hazard zone not found' });
    }
    res.json(hazardZone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const hazardZone = await HazardZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Hazard zone updated successfully', hazardZone });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
