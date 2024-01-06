const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const oleadsSchema = new mongoose.Schema({
  oleadFor:{
    type: String,
    required: true,
    trim: true
  },
  project: {
    type: String,
    trim: true
  },
  siteAddress: {
    type: String,
    trim: true
  },
  siteLocation: {
    type: String,
    trim: true
  },
  enquiryExpectedBy: {
    type: Date,    
  },
  leadSource: {
    type: String,
    trim: true
  },
  leadDate: {
    type: Date
  },
  remark: {
    type: String,
    trim: true
  },
  clientId : {
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
  }
});



const Oleads = mongoose.model("Oleads", oleadsSchema);

module.exports = Oleads;
