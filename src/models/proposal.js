const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const proposalSchema = new mongoose.Schema({

    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        validate: {
            validator: async function (value) {
                const client = await mongoose.model('Client').findById(value);
                return client !== null;
            },
            message: 'Invalid clientId. Client does not exist.'
        }
    },
    status: {
        type: String,
        required: true,
        enum: ["LIVE", "LIVE-HOT","CONSULTANT", "CONTRACTOR"]
    },
    project: {
        type: String,
        required: true,
        trim: true
    },
    projectType: {
        type: String,
        trim: true,
        required: true,
        enum: ["SPV", "SWH"]
    },
    capacity: {
        type: Number,
    },
    uom: {
        type: String,
        required: true,
        enum: ["KWP", "LPD"]
    },
    quotedValue: {
        type: Number,
    },
    quotedMarginPercentage: {
        type: Number
    },
    quotedMarginValue: {
        type: Number
    },
    ratePerWatt: {
        type: Number
    },
    remark: {
        type: String
    }

})

const Proposal = new mongoose.model("Proposal", proposalSchema);
module.exports = Proposal