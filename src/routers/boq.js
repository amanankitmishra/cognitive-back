const express = require('express');
const Boq = require('../models/boq');
const auth = require('../middleware/auth');

const router = express.Router();




// Get all Boqs
router.get('/boqs', auth, async (req, res) => {
  try {
    const boqs = await Boq.find();
    res.json(boqs);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific Boq by ID
router.get('/boqs/:id', auth, async (req, res) => {
  try {
    const boq = await Boq.findById(req.params.id);
    if (!boq) {
      return res.status(404).json({ error: 'Boq not found' });
    }
    res.json(boq);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new Boq
router.post('/boqs', auth, async (req, res) => {
  try {
    const newBoq = new Boq(req.body);
    const savedBoq = await newBoq.save();
    res.status(201).json(savedBoq);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Update a Boq by ID
router.patch('/boqs/:id', auth,  async (req, res) => {
  try {
    const updatedBoq = await Boq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBoq) {
      return res.status(404).json({ error: 'Boq not found' });
    }
    res.json(updatedBoq);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Delete a Boq by ID
router.delete('/boqs/:id', auth, async (req, res) => {
  try {
    const deletedBoq = await Boq.findByIdAndDelete(req.params.id);
    if (!deletedBoq) {
      return res.status(404).json({ error: 'Boq not found' });
    }
    res.json({ message: 'Boq deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
