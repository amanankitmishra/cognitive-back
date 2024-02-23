const express = require("express");
const Vendor = require("../models/vendors");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/vendors", auth, async (req, res) => {
    const vendor = new Vendor(req.body);
    try {
        await client.save();
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

module.exports = router;