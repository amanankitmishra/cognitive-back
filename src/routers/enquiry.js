const express = require("express");
const Enquiry = require("../models/enquiry");
const router = new express.Router();
const auth = require("../middleware/auth");
const EnquiryNumber = require("../models/enquiryNumber");

// Create a new enquiry
router.post("/enquiries", auth, async (req, res) => {
  const quotationNumber = await EnquiryNumber.getNextNumber();
  const ccc = {
    clientId: req.body.clientId,
    project: req.body.project,
    projectType: req.body.projectType,
    capacity: req.body.capacity,
    uom: req.body.uom,
    offerSubmitted: req.body.offerSubmitted,
    enquiryDate: req.body.enquiryDate,
    remark: req.body.remark,
    quotationNumber
  }
  const enquiry = new Enquiry(ccc);
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
    const enquiries = await Enquiry.find().populate('clientId', '_id clientName');
    res.status(200).json(enquiries);
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
    "capacity",
    "clientId",
    "enquiryDate",
    "offerSubmitted",
    "project",
    "projectType",
    "remark",
    "uom"
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
