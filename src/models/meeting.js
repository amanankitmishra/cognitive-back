const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    meetingDate: {
        type: Date,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    clientName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    agenda: {
        type:String,
        trim: true
    }
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;
