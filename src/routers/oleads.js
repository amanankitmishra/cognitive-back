const express = require("express");
const OLead = require("../models/olead");
const router = new express.Router();

// Create a new olead
router.post("/oleads", async (req, res) => {
  const olead = new OLead(req.body);
  try {
    await olead.save();
    res.status(201).send(olead);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all oleads
router.get("/oleads", async (req, res) => {
  try {
    const oleads = await OLead.find();
    res.send(oleads);
  } catch (e) {
    res.status(500).send();
  }
});

// Get olead by ID
router.get("/oleads/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const olead = await OLead.findById(_id);
    if (!olead) {
      return res.status(404).send();
    }
    res.send(olead);
  } catch (e) {
    res.status(500).send();
  }
});

// Update olead by ID
router.patch("/oleads/:id", async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "status", "contactPerson", "contactNumber"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const olead = await OLead.findById(_id);
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
router.delete("/oleads/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const olead = await OLead.findByIdAndDelete(_id);
    if (!olead) {
      return res.status(404).send();
    }
    res.send(olead);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
