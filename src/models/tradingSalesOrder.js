const mongoose = require("mongoose");

const salesOrderSchema = new mongoose.Schema({
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
    salesOrderNo: {
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: String,
        trim: true,
        required: true
    },
    siteLocation: {
        type: String,
        trim: true,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["RUNNING", "COMPLETED"]
    },
    poReceived: {
        type: String,
        required: true,
        enum : ["YES", "NO"]
    },
    poReceivingDate: {
        type: Date,
        required: true
    },
    fy: {
        type: String,
        required: true,
        trim: true
    },
    pan: {
        type: String,
        required: true,
        trim : true
    },
    gst: {
        type: String,
        trim : true,
        required: true
    },
    poNumber: {
        type: String,
        trim: true,
        required: true
    },
    poDate: {
        type: Date,
        required: true
    },
    billToAddress: {
        type: String,
        trim: true,
        required:true
    },
    shipToAddress: {
        type: String,
        trim: true,
        required: true
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
            message: 'Invalid productId. Product does not exist.'
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    uom: {
        type: String,
        trim: true,
        required: true
    },
    totalWithoutGst: {
        type: Number,
        required: true
    },
    valueForGstPercentage: {
        type: Number,
        required: true
    },
    applicableGstPercentage: {
        type: Number,
        required: true
    },
    gstValue: {
        type: Number,
        required: true
    },
    totalWithGst: {
        type: Number,
        required: true
    },
    paymentPercentage: {
        type: Number,
    },
    paymentWithoutGst: {
        type: Number,
    },
    paymentWithGst: {
        type: Number
    },
    paymentStage: {
        type: String,        
    },
    documentType: {
        type: String,
        enum: ["PI","TAX-INVOICE"]
    },
    documentValueWithoutGst: {
        type: Number
    },
    documentValueWithGst: {
        type: Number
    },
    documentNumber: {
        type: String,
    },
    documentDated: {
        type: Date,
    },
    creditAmount: {
        type: Number,
    },
    dueAmountWithGst: {
        type: Number,
    },
    pendingToInvoiceWithoutGst: {
        type: Number,
    },
    pendingToInvoiceWithGst :{
        type: Number,
    },
    billingPercentageDone: {
        type: Number,
    },
    billingPercentagePending: {
        type: Number,
    },
    remark: {
        type: String,
    }


}, { timestamps: true });

const TradingSalesOrder = mongoose.model("TradingSalesOrder", salesOrderSchema);
module.exports = TradingSalesOrder;
