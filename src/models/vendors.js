const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const vendorSchema = new mongoose.Schema({
    vendorName: {
        type: String,
        required: true,
        trim: true,
    },
    officeAddress: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    state: {
        type: String,
        trim: true
    },
    contactPersons: [
        {
            contactPerson: {
                type: String,
                required: true,
                trim: true,
            },
            contactNumber: {
                type: String,
                trim: true,
            },
            contactEmail: {
                type: String,
                trim: true,
            },
            contactDesignation: {
                type: String,
                trim: true
            }
        }
    ]
}, { timestamps: true });



const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
