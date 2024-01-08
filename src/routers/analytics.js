const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Client = require("../models/clients");
const Olead = require("../models/oleads");
const Enquiry = require("../models/enquiry");
const Proposal = require("../models/proposal")

// Get all analytics (number of clients, oleads, enquiries, and proposals)
router.get("/allAnalytics", auth, async (req, res) => {
  try {
    const clientsCount = await Client.countDocuments();
    const oleadsCount = await Olead.countDocuments();
    const enquiriesCount = await Enquiry.countDocuments();
    const proposalsCount = await Proposal.countDocuments();

    const analyticsData = {
      clients: clientsCount,
      oleads: oleadsCount,
      enquiries: enquiriesCount,
      proposals: proposalsCount,
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
