const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const enquirySchema = new mongoose.Schema({
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
    project: {
        type: String,
        trim: true
    },
    projectType: {
        type: String,
        trim: true,
        enum: ["SPV","SWH"]
    },
    capacity: {
        type: Number,
        trim: true
    },
    uom: {
        type: String,
        trim: true,
        enum: ["KWP", "LPD"]
    },
    offerSubmitted: {
        type: String,
        trim: true,
        enum: ["YES", "NO"]
    },
    offerSubmissionDate: {
        type: Date,
        trim: true
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
    revision: {
        type: String,
        trim: true,
        enum: ["R1", "R2", "R3", "R4", "R5"]
    },
    ratePerWatt: {
        type: Number
    },
    remark: {
        type: String,
        trim:true
    }

})


const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;