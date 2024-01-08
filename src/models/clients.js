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
          purpose:{
            type: String,
            trim: true
          },
          summary: {
            type: String,
            trim: true
          }
        },
      ],
});




const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
