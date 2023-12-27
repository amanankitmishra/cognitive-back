const express = require("express");
const Client = require("../models/clients")
const router = new express.Router();
const auth = require("../middleware/auth");

// Create a new client
router.post("/clients", auth, async (req, res) => {
  const client = new Client(req.body);
  try {
    await client.save();
    res.status(201).send(client);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all clients
router.get("/clients", auth, async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).send({allClients: clients});
  } catch (e) {
    res.status(500).send();
  }
});

// Get client by ID
router.get("/clients/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const client = await Client.findById(_id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (e) {
    res.status(500).send();
  }
});

// Update client by ID
router.patch("/clients/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["clientName", "officeAddress", "nature", "lastVisit", "nextVisit", "contactPersons"];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const client = await Client.findById(_id);
    if (!client) {
      return res.status(404).send();
    }

    updates.forEach((update) => (client[update] = req.body[update]));
    await client.save();

    res.send(client);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete client by ID
router.delete("/clients/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const client = await Client.findByIdAndDelete(_id);
    if (!client) {
      return res.status(404).send();
    }
    res.send(client);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
