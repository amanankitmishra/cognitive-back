const express = require("express");
const Vendor = require("../models/vendors");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/vendors", auth, async (req, res) => {
    const vendor = new Vendor(req.body);
    try {
        await vendor.save();
        res.status(201).send(vendor);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get("/vendors", auth, async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).send({ allVendors: vendors });
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/vendors/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
      const vendor = await Vendor.findByIdAndDelete(_id);
      if (!vendor) {
        return res.status(404).send();
      }
      res.send(vendor);
    } catch (e) {
      res.status(500).send();
    }
  });

  router.get("/vendors/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
      const vendor = await Vendor.findById(_id);
      if (!vendor) {
        return res.status(404).send({ error: " no vendor" });
      }
      res.send({vendor});
    } catch (e) {
      res.status(500).send();
    }
  });

  router.post("/vendors/addContactPerson/:id", auth, async (req, res) => {
    const vendorId = req.params.id;
  
    try {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
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
      vendor.contactPersons.push(newContactPerson);
  
      // Save the updated client
      await vendor.save();
  
      res.status(201).send(vendor);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  router.patch('/vendors/editContactPerson/:clientId/contactPersons/:contactPersonId', auth, async (req, res) => {
    const vendorId = req.params.clientId;
    const contactPersonId = req.params.contactPersonId;
  
    try {
      const vendor = await Vendor.findById(vendorId);
  
      // Find the index of the contactPerson in the array
      const contactPersonIndex = vendor.contactPersons.findIndex(
        (cp) => cp._id.toString() === contactPersonId
      );
  
      // Check if the contactPerson exists
      if (contactPersonIndex === -1) {
        return res.status(404).json({ error: 'Contact Person not found' });
      }
  
      // Update the contactPerson details
      vendor.contactPersons[contactPersonIndex] = {
        ...vendor.contactPersons[contactPersonIndex],
        ...req.body, // Update with the request body
      };
  
      await vendor.save();
      res.json(vendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  });

  router.delete("/vendors/deleteContactPerson/:vendorId/contactPersons/:contactId", auth, async (req, res) => {
    const vendorId = req.params.vendorId;
    const contactPersonId = req.params.contactId;
  
    try {
      const vendor = await Vendor.findById(vendorId);
  
      // Find the index of the contactPerson in the array
      const contactPersonIndex = vendor.contactPersons.findIndex(
        (cp) => cp._id.toString() === contactPersonId
      );
  
      // Check if the contactPerson exists
      if (contactPersonIndex === -1) {
        return res.status(404).json({ error: 'Contact Person not found' });
      }
  
      // Remove the contactPerson from the array
      vendor.contactPersons.splice(contactPersonIndex, 1);
  
      await vendor.save();
      res.json(vendor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server Error' });
    }
  
  })

module.exports = router;