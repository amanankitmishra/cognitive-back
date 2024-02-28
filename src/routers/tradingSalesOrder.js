const express = require("express");
const router = express.Router();
const SalesOrder = require("../models/tradingSalesOrder"); 
const auth = require('../middleware/auth')

// Create a new sales order
router.post("/tradingSalesOrders", auth, async (req, res) => {
    try {
        const salesOrder = new SalesOrder(req.body);
        await salesOrder.save();
        res.status(201).send(salesOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all sales orders
router.get("/tradingSalesOrders", auth, async (req, res) => {
    try {
        const salesOrders = await SalesOrder.find().populate('clientId', '_id clientName');
        res.send(salesOrders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific sales order by ID
router.get("/tradingSalesOrders/:id", auth, async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findById(req.params.id);
        if (!salesOrder) {
            return res.status(404).send({ error: "Sales order not found" });
        }
        res.send(salesOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a sales order by ID
router.patch("/tradingSalesOrders/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = Object.keys(SalesOrder.schema.obj);

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const salesOrder = await SalesOrder.findById(req.params.id);

        if (!salesOrder) {
            return res.status(404).send({ error: "Sales order not found" });
        }

        updates.forEach(update => (salesOrder[update] = req.body[update]));
        await salesOrder.save();

        res.send(salesOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a sales order by ID
router.delete("/tradingSalesOrders/:id", auth, async (req, res) => {
    try {
        const salesOrder = await SalesOrder.findByIdAndDelete(req.params.id);
        if (!salesOrder) {
            return res.status(404).send({ error: "Sales order not found" });
        }
        res.send(salesOrder);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
