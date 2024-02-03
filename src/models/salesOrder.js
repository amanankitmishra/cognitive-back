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
        trim: true,
        required: true
    },
    poReceived: {
        type: String,
        trim: true,
        required: true
    },
    poReceivingDate: {
        type: Date,
        required: true
    },
    fy: {
        type: String,
        trim: true,
        required: true
    },
    panNo: {
        type: String,
        trim: true,
        required: true
    },
    gstNo: {
        type: String,
        trim: true,
        required: true
    },
    poNo: {
        type: String,
        trim: true,
        required: true
    },
    poDate: {
        type: Date,
        required: true
    },
    spvSwh: {
        type: String,
        trim: true,
        required: true
    },
    capacity: {
        type: String,
        trim: true,
        required: true
    },
    uom: {
        type: String,
        trim: true,
        required: true
    },
    remark: {
        type: String,
        trim: true,
        required: true
    },
    totalWOGST: {
        type: Number,
        default: 0,
        required: true
    },
    firstValueForGSTPercent: {
        type: Number,
        default: 0,
        required: true
    },
    firstApplicableGST: {
        type: Number,
        default: 18,
        required: true
    },
    firstGSTValue: {
        type: Number,
        default: 0,
        required: true
    },
    firstWithGST: {
        type: Number,
        default: 0,
        required: true
    },
    secondValueForGSTPercent: {
        type: Number,
        default: 0,
        required: true
    },
    secondApplicableGST: {
        type: Number,
        default: 12,
        required: true
    },
    secondGSTValue: {
        type: Number,
        default: 0,
        required: true
    },
    secondWithGST: {
        type: Number,
        default: 0,
        required: true
    },
    paymentPercentage: {
        type: String,
        trim: true,
        required: true
    },
    paymentWOGST: {
        type: String,
        trim: true,
        required: true
    },
    paymentWithGST: {
        type: String,
        trim: true,
        required: true
    },
    paymentStage: {
        type: String,
        trim: true,
        required: true
    },
    documentType: {
        type: String,
        trim: true,
        required: true
    },
    documentValueWOGST: {
        type: Number,
        default: 0,
        required: true
    },
    documentValueWithGST: {
        type: Number,
        default: 0,
        required: true
    },
    documentNo: {
        type: String,
        trim: true,
        required: true
    },
    documentDated: {
        type: Date,
        required: true
    },
    creditAmount: {
        type: Number,
        default: 0,
        required: true
    },
    dueAmountWithGST: {
        type: Number,
        default: 0,
        required: true
    },
    pendingToInvoiceWOGST: {
        type: Number,
        default: 0,
        required: true
    },
    pendingToInvoiceWithGST: {
        type: Number,
        default: 0,
        required: true
    },
    billingDonePercentage: {
        type: Number,
        default: 0,
        required: true
    },
    billingPendingPercentage: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true });

const SalesOrder = mongoose.model("SalesOrder", salesOrderSchema);
module.exports = SalesOrder;
