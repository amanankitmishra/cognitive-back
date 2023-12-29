const express = require("express");
const Enquiry = require("../models/enquiry");
const router = new express.Router();
const auth = require("../middleware/auth");

// Create a new enquiry
router.post("/enquiries", auth, async (req, res) => {
  const enquiry = new Enquiry(req.body);
  try {
    await enquiry.save();
    res.status(201).send(enquiry);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all enquiries
router.get("/enquiries", auth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('clientId', '_id clientName'); ;
    res.status(200).send({ allEnquiries: enquiries });
  } catch (e) {
    res.status(500).send();
  }
});

// Get enquiry by ID
router.get("/enquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const enquiry = await Enquiry.findById(_id);
    if (!enquiry) {
      return res.status(404).send();
    }
    res.send(enquiry);
  } catch (e) {
    res.status(500).send();
  }
});

// Update enquiry by ID
router.patch("/enquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "clientId",
    "project",
    "projectType",
    "capacity",
    "uom",
    "offerSubmitted",
    "offerSubmissionDate",
    "quotedValue",
    "quotedMarginPercentage",
    "quotedMarginValue",
    "revision",
    "ratePerWatt",
    "remark"
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const enquiry = await Enquiry.findById(_id);
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
router.delete("/enquiries/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const enquiry = await Enquiry.findByIdAndDelete(_id);
    if (!enquiry) {
      return res.status(404).send();
    }
    res.send(enquiry);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
