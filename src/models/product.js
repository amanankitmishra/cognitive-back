const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)
module.exports = Product;