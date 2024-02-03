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

// Function to get the current financial year
const getCurrentFinancialYear = () => {
  const currentDate = new Date();
  const fiscalYearStartMonth = 4; // Assuming the fiscal year starts in April
  const currentMonth = currentDate.getMonth() + 1;

  const fiscalYear =
    currentMonth < fiscalYearStartMonth
      ? currentDate.getFullYear() - 1
      : currentDate.getFullYear();

  return fiscalYear;
};

// Route to fetch data for proposal reports
router.get('/proposalReports', auth, async (req, res) => {
  try {
    const currentYear = getCurrentFinancialYear();

    // Calculate start and end dates for the current financial year
    const startDate = new Date(`${currentYear}-04-01T00:00:00.000Z`);
    const endDate = new Date(`${currentYear + 1}-03-31T23:59:59.999Z`);

    // Fetch all proposals for the current financial year
    const proposals = await Proposal.find({
      createdAt: { $gte: startDate, $lt: endDate },
    });

    res.json({ proposals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/enquiryReports', auth, async (req, res) => {
  try {
    // Fetch Enquiry data
    const enquiries = await Enquiry.find();

    // Process data for the graph
    const monthlyData = Array.from({ length: 12 }, () => ({ count: 0 }));

    enquiries.forEach((enquiry) => {
      const month = new Date(enquiry.createdAt).getMonth();
      monthlyData[month].count += 1;
    });

    res.json({ monthlyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
