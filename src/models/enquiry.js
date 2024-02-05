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
    enquiryDate: {
        type: Date,
        trim: true
    },
    remark: {
        type: String,
        trim:true
    }

}, { timestamps: true })


const Enquiry = mongoose.model("Enquiry", enquirySchema);

module.exports = Enquiry;