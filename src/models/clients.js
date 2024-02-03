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
    nature: {
        type: String,
        required: true,
        trim: true,
        enum: ["contractor", "consultant", "others", "endCustomer"]
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
    ],
    visits: [
        {
            visitDate: {
                type: Date,
                required: true,
            },
            purpose: {
                type: String,
                trim: true
            },
            summary: {
                type: String,
                trim: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
                validate: {
                    validator: async function (value) {
                        const client = await mongoose.model('User').findById(value);
                        return client !== null;
                    },
                    message: 'Invalid userId. User does not exist.'
                }
            }
        },
    ],
}, { timestamps: true });




const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
