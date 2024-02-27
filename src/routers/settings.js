const express = require('express');
const TradingEnquiryNumber = require('../models/tradingEnquiryNumber');
const TradingProposalNumber = require('../models/tradingProposalNumber');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a new tradingEnquiryNumber
router.post('/tradingEnquiryNumber', auth, async (req, res) => {
    try {
        const ccc = {
            prefix: req.body.prefix,
            startingNumber : req.body.startingNumber,
            currentNumber : req.body.startingNumber
        }
        const tradingEnquiryNumber = new TradingEnquiryNumber(ccc);
        await tradingEnquiryNumber.save();
        res.status(201).send(tradingEnquiryNumber);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read: Get the next tradingEnquiryNumber
router.get('/nextTradingEnquiryNumber', auth, async (req, res) => {
    try {
        const updatedCurrentNumber = await TradingEnquiryNumber.getNextNumber();
        if (updatedCurrentNumber) {
            res.status(200).send({ currentNumber: updatedCurrentNumber });
        } else {
            res.status(404).send("No active Sequence");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Read: Get all tradingEnquiryNumbers
router.get('/tradingEnquiryNumbers', auth, async (req, res) => {
    try {
        const tradingEnquiryNumbers = await TradingEnquiryNumber.find();
        res.status(200).send(tradingEnquiryNumbers);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Read: Get tradingEnquiryNumber by ID
router.get('/tradingEnquiryNumber/:id', auth, async (req, res) => {
    try {
        const tradingEnquiryNumber = await TradingEnquiryNumber.findById(req.params.id);
        if (!tradingEnquiryNumber) {
            return res.status(404).send("TradingEnquiryNumber not found");
        }
        res.status(200).send(tradingEnquiryNumber);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Update: Update tradingEnquiryNumber by ID
router.patch('/tradingEnquiryNumber/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['currentNumber', 'active'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const existingTradingEnquiryNumber = await TradingEnquiryNumber.findById(req.params.id);

        if (!existingTradingEnquiryNumber) {
            return res.status(404).send("TradingEnquiryNumber not found");
        }

        // Disallow updating startingNumber
        if ('startingNumber' in req.body) {
            return res.status(400).send({ error: 'Cannot update startingNumber' });
        }

        // Ensure that the new currentNumber is always larger than the existing currentNumber
        if ('currentNumber' in req.body && req.body.currentNumber <= existingTradingEnquiryNumber.currentNumber) {
            return res.status(400).send({ error: 'New currentNumber must be larger than the existing currentNumber' });
        }

        if ('active' in req.body && req.body.active === true) {
            await TradingEnquiryNumber.updateMany(
                { _id: { $ne: req.params.id } }, 
                { $set: { active: false } }
            );
        }

        const tradingEnquiryNumber = await TradingEnquiryNumber.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!tradingEnquiryNumber) {
            return res.status(404).send("TradingEnquiryNumber not found");
        }

        res.status(200).send(tradingEnquiryNumber);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// Delete: Delete tradingEnquiryNumber by ID
router.delete('/tradingEnquiryNumber/:id', auth, async (req, res) => {
    try {
        const tradingEnquiryNumber = await TradingEnquiryNumber.findById(req.params.id);

        if (!tradingEnquiryNumber) {
            return res.status(404).send("TradingEnquiryNumber not found");
        }

        if (tradingEnquiryNumber.active) {
            return res.status(400).send("Cannot delete an active TradingEnquiryNumber");
        }

        const deletedTradingEnquiryNumber = await TradingEnquiryNumber.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedTradingEnquiryNumber);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});


// Create a new tradingProposalNumber
router.post('/tradingProposalNumber', auth, async (req, res) => {
    try {
        const ccc = {
            prefix: req.body.prefix,
            startingNumber : req.body.startingNumber,
            currentNumber : req.body.startingNumber
        }
        const tradingProposalNumber = new TradingProposalNumber(ccc);
        await tradingProposalNumber.save();
        res.status(201).send(tradingProposalNumber);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read: Get the next tradingProposalNumber
router.get('/nextTradingEnquiryNumber', auth, async (req, res) => {
    try {
        const updatedCurrentNumber = await TradingProposalNumber.getNextNumber();
        if (updatedCurrentNumber) {
            res.status(200).send({ currentNumber: updatedCurrentNumber });
        } else {
            res.status(404).send("No active Sequence");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Read: Get all tradingProposalNumbers
router.get('/tradingProposalNumbers', auth, async (req, res) => {
    try {
        const tradingProposalNumbers = await TradingProposalNumber.find();
        res.status(200).send(tradingProposalNumbers);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Read: Get tradingProposalNumber by ID
router.get('/tradingProposalNumber/:id', auth, async (req, res) => {
    try {
        const tradingProposalNumber = await TradingProposalNumber.findById(req.params.id);
        if (!tradingProposalNumber) {
            return res.status(404).send("TradingProposalNumber not found");
        }
        res.status(200).send(tradingProposalNumber);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});

// Update: Update tradingProposalNumber by ID
router.patch('/tradingProposalNumber/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['currentNumber', 'active'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const existingTradingEnquiryNumber = await TradingProposalNumber.findById(req.params.id);

        if (!existingTradingEnquiryNumber) {
            return res.status(404).send("TradingProposalNumber not found");
        }

        // Disallow updating startingNumber
        if ('startingNumber' in req.body) {
            return res.status(400).send({ error: 'Cannot update startingNumber' });
        }

        // Ensure that the new currentNumber is always larger than the existing currentNumber
        if ('currentNumber' in req.body && req.body.currentNumber <= existingTradingEnquiryNumber.currentNumber) {
            return res.status(400).send({ error: 'New currentNumber must be larger than the existing currentNumber' });
        }

        if ('active' in req.body && req.body.active === true) {
            await TradingProposalNumber.updateMany(
                { _id: { $ne: req.params.id } }, 
                { $set: { active: false } }
            );
        }

        const tradingProposalNumber = await TradingProposalNumber.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!tradingProposalNumber) {
            return res.status(404).send("TradingProposalNumber not found");
        }

        res.status(200).send(tradingProposalNumber);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

// Delete: Delete tradingProposalNumber by ID
router.delete('/tradingProposalNumber/:id', auth, async (req, res) => {
    try {
        const tradingProposalNumber = await TradingProposalNumber.findById(req.params.id);

        if (!tradingProposalNumber) {
            return res.status(404).send("TradingProposalNumber not found");
        }

        if (tradingProposalNumber.active) {
            return res.status(400).send("Cannot delete an active TradingProposalNumber");
        }

        const deletedTradingEnquiryNumber = await TradingProposalNumber.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedTradingEnquiryNumber);
    } catch (error) {
        console.error(error);
        res.status(500).send();
    }
});


module.exports = router;
