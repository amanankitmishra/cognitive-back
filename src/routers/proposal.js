const express = require('express');
const Proposal = require('../models/proposal');
const auth = require('../middleware/auth');

const router = express.Router();



// Get all Proposals
router.get('/proposals', auth, async (req, res) => {
  try {
    const proposals = await Proposal.find().populate('clientId', '_id clientName');
    res.json(proposals);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a specific Proposal by ID
router.get('/proposals/:id', auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(proposal);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new Proposal
router.post('/proposals', auth, async (req, res) => {
  try {
    const newProposal = new Proposal(req.body);
    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Update a Proposal by ID
router.put('/proposals/:id', auth, async (req, res) => {
  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json(updatedProposal);
  } catch (error) {
    res.status(400).json({ error: 'Invalid request body' });
  }
});

// Delete a Proposal by ID
router.delete('/proposals/:id', auth, async (req, res) => {
  try {
    const deletedProposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!deletedProposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }
    res.json({ message: 'Proposal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all HOT proposals
router.get("/liveproposals", auth, async (req, res) => {
    try {
      // Fetch all "HOT" proposals from the database
      const hotProposals = await Proposal.find({ status: "LIVE" }).populate('clientId', '_id clientName');
  
      res.status(200).json(hotProposals);
    } catch (error) {
      console.error('Error fetching HOT proposals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to get all LIVE-HOT proposals
router.get("/livehotproposals", auth, async (req, res) => {
    try {
      // Fetch all "HOT" proposals from the database
      const livehotProposals = await Proposal.find({ status: "LIVE-HOT" }).populate('clientId', '_id clientName');
  
      res.status(200).json(livehotProposals);
    } catch (error) {
      console.error('Error fetching LIVE HOT proposals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/consultantproposals", auth, async (req, res) => {
    try {
      // Fetch all "HOT" proposals from the database
      const Proposals = await Proposal.find({ status: "CONSULTANT" }).populate('clientId', '_id clientName');
  
      res.status(200).json(Proposals);
    } catch (error) {
      console.error('Error fetching Consultant proposals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get("/contractorproposals", auth, async (req, res) => {
    try {
      // Fetch all "HOT" proposals from the database
      const Proposals = await Proposal.find({ status: "CONTRACTOR" }).populate('clientId', '_id clientName');
  
      res.status(200).json(Proposals);
    } catch (error) {
      console.error('Error fetching Contractor proposals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
