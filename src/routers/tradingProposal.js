const express = require("express");
const Proposal = require("../models/tradingProposal");
const Product = require("../models/product");
const auth = require("../middleware/auth");
const { multipleUpload } = require("../utility/fileUpload");
const TradingProposalNumber = require("../models/tradingProposalNumber");

const router = express.Router();

// Get all Proposals
router.get("/tradingProposals", auth, async (req, res) => {
  try {
    const tradingProposals = await Proposal.find().populate(
      "clientId",
      "_id clientName"
    );
    res.json(tradingProposals);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a specific Proposal by ID
router.get("/tradingProposals/:id", auth, async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    const product = await Product.findById(proposal.productId)
    res.json({proposal,product});
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new Proposal
router.post("/tradingProposals", auth, async (req, res) => {
  try {
    const quotationNumber = await TradingProposalNumber.getNextNumber();
    const ccc = {
      status: req.body.status,
      project: req.body.project,
      productId: req.body.productId,
      quantity: req.body.quantity,
      uom: req.body.uom,
      clientId: req.body.clientId,
      quotedValueToClient: req.body.quotedValueToClient,
      vendorId: req.body.vendorId,
      quotedValueToVendor: req.body.quotedValueToVendor,
      marginValue: req.body.marginValue,
      marginPercentage: req.body.marginPercentage,
      currentStatus: req.body.currentStatus,
      actionPlan: req.body.actionPlan,
      remarks: req.body.remarks,
      quotationNumber
    };
    const newProposal = new Proposal(ccc);
    const savedProposal = await newProposal.save();
    res.status(201).json(savedProposal);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// Update a Proposal by ID
router.put("/tradingProposals/:id", auth, async (req, res) => {
  try {
    const updatedProposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    res.json(updatedProposal);
  } catch (error) {
    res.status(400).json({ error: "Invalid request body" });
  }
});

// Delete a Proposal by ID
router.delete("/tradingProposals/:id", auth, async (req, res) => {
  try {
    const deletedProposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!deletedProposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    res.json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all HOT tradingProposals
router.get("/livetradingproposals", auth, async (req, res) => {
  try {
    // Fetch all "HOT" tradingProposals from the database
    const hotProposals = await Proposal.find({ status: "LIVE" }).populate(
      "clientId",
      "_id clientName"
    );
    res.status(200).json(hotProposals);
  } catch (error) {
    console.error("Error fetching HOT tradingProposals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all LIVE-HOT tradingProposals
router.get("/livehottradingproposals", auth, async (req, res) => {
  try {
    // Fetch all "HOT" tradingProposals from the database
    const livehotProposals = await Proposal.find({
      status: "LIVE-HOT",
    }).populate("clientId", "_id clientName");

    res.status(200).json(livehotProposals);
  } catch (error) {
    console.error("Error fetching LIVE HOT tradingProposals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/contractortradingproposals", auth, async (req, res) => {
  try {
    // Fetch all "HOT" tradingProposals from the database
    const Proposals = await Proposal.find({ status: "CONTRACTOR" }).populate(
      "clientId",
      "_id clientName"
    );

    res.status(200).json(Proposals);
  } catch (error) {
    console.error("Error fetching Contractor tradingProposals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/tradingProposalAddRevision/:proposalId",
  multipleUpload,
  async (req, res) => {
    const { proposalId } = req.params;
    const { revisionNumber, comment } = req.body;
    const files = req.files.map((file) => file.path);

    try {
      // Find the proposal by ID
      const proposal = await Proposal.findById(proposalId);

      if (!proposal) {
        return res.status(404).json({ error: "Proposal not found" });
      }

      // Check if the revisionNumber is unique
      const isUnique = proposal.revisions.every(
        (revision) => revision.revisionNumber !== revisionNumber
      );

      if (!isUnique) {
        return res
          .status(400)
          .json({ error: "Revision number must be unique" });
      }

      // Add the new revision with file details
      proposal.revisions.push({ revisionNumber, files, comment });

      // Save the updated proposal
      await proposal.save();

      res.status(201).json(proposal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = router;
