const express = require('express');
const router = express.Router();
const Meeting = require('../models/meeting');
const auth = require("../middleware/auth");

// Create a meeting
router.post('/meetings', auth, async (req, res) => {
    try {
        const { meetingDate, clientId, clientName, location, agenda } = req.body;
        const userId = req.user._id;

        const newMeeting = new Meeting({
            meetingDate,
            clientId,
            clientName,
            location,
            userId,
            agenda
        });

        await newMeeting.save();

        res.status(201).json({ message: 'Meeting created successfully', meeting: newMeeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Read all meetings
router.get('/meetings', auth, async (req, res) => {
    try {
        const meetings = await Meeting.find({ userId: req.user._id, status: true});

        res.status(200).json({ meetings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Read a specific meeting by ID
router.get('/meetings/:id', auth, async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        if (meeting.userId != req.user._id) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json({ meeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a meeting by ID
router.patch('/meetings/:id', auth, async (req, res) => {
    try {
        const { meetingDate, clientId, clientName, location } = req.body;
        const userId = req.user._id;

        const updatedMeeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            {
                meetingDate,
                clientId,
                clientName,
                location,
                userId
            },
            { new: true } // Return the updated meeting
        );

        if (!updatedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json({ message: 'Meeting updated successfully', meeting: updatedMeeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a meeting by ID
router.delete('/meetings/:id', auth, async (req, res) => {
    try {
        const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);

        if (!deletedMeeting) {
            return res.status(404).json({ message: 'Meeting not found' });
        }

        res.status(200).json({ message: 'Meeting deleted successfully', meeting: deletedMeeting });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
