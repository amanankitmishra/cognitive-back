const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const boqSchema = new mongoose.Schema({
    itemHead: {
        type: String,
        required: true,
      },
      specification: {
        type: String,
        required: true,
      },
      make: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      uom: {
        type: String,
        required: true,
      },
      remark: {
        type: String,
      },
}, { timestamps: true })

const Boq = mongoose.model('Boq', boqSchema)
module.exports= Boq;