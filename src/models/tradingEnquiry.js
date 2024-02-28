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
    quotationNumber: {
        type: String,
        required: true
    },
    enquiryDate: {
        type: Date,
        trim: true
    },
    project: {
        type: String,
        trim: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: {
            validator: async function (value) {
                const client = await mongoose.model('Product').findById(value);
                return client !== null;
            },
            message: 'Invalid Product ID. Product does not exist.'
        }
    },
    offerSubmitted: {
        type: String,
        trim: true,
        enum: ["YES", "NO"]
    },
    offerSubmissionDate: {
        type: Date,
    },    
    remark: {
        type: String,
        trim:true
    }

}, { timestamps: true })


const TradingEnquiry = mongoose.model("TradingEnquiry", enquirySchema);

module.exports = TradingEnquiry;