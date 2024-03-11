const express = require("express");
const Oleads = require("../models/oleads");
const router = new express.Router();
const auth = require("../middleware/auth");

// Create a new olead
router.post("/oleads", auth, async (req, res) => {
  const olead = new Oleads(req.body);
  try {
    await olead.save();
    res.status(201).send(olead);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all oleads
router.get("/oleads", auth, async (req, res) => {
  try {
    const oleads = await Oleads.find().populate('clientId', '_id clientName');
    res.status(200).send({ allOleads: oleads });
  } catch (e) {
    res.status(500).send();
  }
});

// Get olead by ID
router.get("/oleads/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const olead = await Oleads.findById(_id);
    if (!olead) {
      return res.status(404).send();
    }
    res.send(olead);
  } catch (e) {
    res.status(500).send();
  }
});

// Update olead by ID
router.patch("/oleads/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "oleadFor",
    "project",
    "siteAddress",
    "siteLocation",
    "enquiryExpectedBy",
    "leadSource",
    "leadDate",
    "clientId",
    "remark"
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const olead = await Oleads.findById(_id);
    if (!olead) {
      return res.status(404).send();
    }

    updates.forEach((update) => (olead[update] = req.body[update]));
    await olead.save();

    res.send(olead);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete olead by ID
router.delete("/oleads/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const olead = await Oleads.findByIdAndDelete(_id);
    if (!olead) {
      return res.status(404).send();
    }
    res.send(olead);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
