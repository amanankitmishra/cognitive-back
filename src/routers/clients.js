const express = require("express");
const Client = require("../models/clients")
const Proposal = require("../models/proposal")
const Enquiry = require("../models/enquiry")
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
    res.status(200).send({ allClients: clients });
  } catch (e) {
    res.status(500).send();
  }
});

// Get client by ID
router.get("/clients/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const client = await Client.findById(_id);
    const proposals = await Proposal.find({clientId: _id});
    const enquiries = await Enquiry.find({clientId: _id});
    if (!client) {
      return res.status(404).send({ error: " no client" });
    }
    res.send({client, proposals, enquiries});
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
    res.status(400).send({ error: e });
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

// Add contact person to client by ID
router.post("/clients/addContactPerson/:id", auth, async (req, res) => {
  const clientId = req.params.id;

  try {
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).send();
    }

    // Extract contact person details from the request body
    const { contactPerson, contactNumber, contactEmail, contactDesignation } = req.body;

    // Validate that contactPerson is provided
    if (!contactPerson) {
      return res.status(400).send({ error: "Contact person name is required." });
    }

    // Create a new contact person object
    const newContactPerson = {
      contactPerson,
      contactNumber,
      contactEmail,
      contactDesignation
    };

    // Push the new contact person to the client's contactPersons array
    client.contactPersons.push(newContactPerson);

    // Save the updated client
    await client.save();

    res.status(201).send(client);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Edit Contact Person
router.patch('/clients/editContactPerson/:clientId/contactPersons/:contactPersonId', auth, async (req, res) => {
  const clientId = req.params.clientId;
  const contactPersonId = req.params.contactPersonId;

  try {
    const client = await Client.findById(clientId);

    // Find the index of the contactPerson in the array
    const contactPersonIndex = client.contactPersons.findIndex(
      (cp) => cp._id.toString() === contactPersonId
    );

    // Check if the contactPerson exists
    if (contactPersonIndex === -1) {
      return res.status(404).json({ error: 'Contact Person not found' });
    }

    // Update the contactPerson details
    client.contactPersons[contactPersonIndex] = {
      ...client.contactPersons[contactPersonIndex],
      ...req.body, // Update with the request body
    };

    await client.save();
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete("/clients/deleteContactPerson/:clientId/contactPersons/:contactId", auth, async (req, res) => {
  const clientId = req.params.clientId;
  const contactPersonId = req.params.contactId;

  try {
    const client = await Client.findById(clientId);

    // Find the index of the contactPerson in the array
    const contactPersonIndex = client.contactPersons.findIndex(
      (cp) => cp._id.toString() === contactPersonId
    );

    // Check if the contactPerson exists
    if (contactPersonIndex === -1) {
      return res.status(404).json({ error: 'Contact Person not found' });
    }

    // Remove the contactPerson from the array
    client.contactPersons.splice(contactPersonIndex, 1);

    await client.save();
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }

})

// Add a new visit to the client
router.post("/clients/addVisit/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const client = await Client.findById(_id);
    if (!client) {
      return res.status(404).send();
    }
    const userId = req.user._id;
    const { visitDate, purpose, summary } = req.body;
    client.visits.push({ visitDate, purpose, summary, userId });

    await client.save();
    res.status(201).send(client);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get Client List

router.get("/allClients/names", auth, async (req, res) => {
  try {
    const clients = await Client.find().select("_id clientName").sort({ clientName: -1 });
    res.status(200).send(clients);
  } catch (e) {
    res.status(500).send(e);
  }
});

//Get all visits

router.get('/visits', async (req, res) => {
  try {
    // Fetch all clients from the database
    const clients = await Client.find({}, 'clientName visits');

    // Transform clients' visits into the desired format
    const allVisits = clients.flatMap((client) => {
      return client.visits.map((visit) => ({
        clientName: client.clientName,
        visitDate: visit.visitDate,
        purpose: visit.purpose,
        summary: visit.summary,
      }));
    });

    // Respond with the transformed data
    res.status(200).json(allVisits);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
