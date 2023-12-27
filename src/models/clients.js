const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const clientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: true,
        trim: true,
    },
    officeAddress: {
        type: String,
        required: true,
        trim: true
    },
    nature: {
        type: String,
        required: true,
        trim: true,
        enum: ["contractor","consultant","others"]
    },
    lastVisit: {
        type: Date        
    },
    nextVisit: {
        type :Date
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
                validate: {
                    validator: validator.isEmail,
                    message: "{VALUE} is not a valid email",
                },
            },
        }
    ]
});




const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
