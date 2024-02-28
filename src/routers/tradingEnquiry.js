const express = require("express");
const TradingEnquiry = require("../models/tradingEnquiry");
const router = new express.Router();
const auth = require("../middleware/auth");
const TradingEnquiryNumber = require("../models/tradingEnquiryNumber");

// Create a new enquiry
router.post("/tradingEnquiries", auth, async (req, res) => {
  const quotationNumber = await TradingEnquiryNumber.getNextNumber();

  const ccc = {
    clientId: req.body.clientId,
    project: req.body.project,
    productId: req.body.productId,
    offerSubmitted: req.body.offerSubmitted,
    offerSubmissionDate: req.body.offerSubmissionDate,
    enquiryDate: req.body.enquiryDate,
    remark: req.body.remark,
    quotationNumber
  };
  const enquiry = new TradingEnquiry(ccc);
  try {
    await enquiry.save();
    res.status(201).send(enquiry);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all tradingEnquiries
router.get("/tradingEnquiries", auth, async (req, res) => {
  try {
    const tradingEnquiries = await TradingEnquiry.find().populate(
      "clientId",
      "_id clientName"
    );
    res.status(200).json(tradingEnquiries);
  } catch (e) {
    res.status(500).send();
  }
});

// Get enquiry by ID
router.get("/tradingEnquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const enquiry = await TradingEnquiry.findById(_id);
    if (!enquiry) {
      return res.status(404).send();
    }
    res.send(enquiry);
  } catch (e) {
    res.status(500).send();
  }
});

// Update enquiry by ID
router.patch("/tradingEnquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "capacity",
    "clientId",
    "enquiryDate",
    "offerSubmitted",
    "project",
    "projectType",
    "remark",
    "uom",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const enquiry = await TradingEnquiry.findById(_id);
    if (!enquiry) {
      return res.status(404).send();
    }

    updates.forEach((update) => (enquiry[update] = req.body[update]));
    await enquiry.save();

    res.send(enquiry);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete enquiry by ID
router.delete("/tradingEnquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const enquiry = await TradingEnquiry.findByIdAndDelete(_id);
    if (!enquiry) {
      return res.status(404).send();
    }
    res.send(enquiry);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
