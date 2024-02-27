const mongoose = require("mongoose");

const tradingProposalSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["LIVE", "LIVE-HOT", "CONTRACTOR"],
    },
    quotationNumber: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
      trim: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      validate: {
        validator: async function (value) {
          const client = await mongoose.model("Product").findById(value);
          return client !== null;
        },
        message: "Invalid Product ID. Product does not exist.",
      },
    },
    quantity: {
      type: Number,
    },
    uom: {
      type: String,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      validate: {
        validator: async function (value) {
          const client = await mongoose.model("Client").findById(value);
          return client !== null;
        },
        message: "Invalid clientId. Client does not exist.",
      },
    },
    quotedValueToClient: {
      type: Number,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      validate: {
        validator: async function (value) {
          const client = await mongoose.model("Vendor").findById(value);
          return client !== null;
        },
        message: "Invalid vendorId. Vendor does not exist.",
      },
    },
    quotedValueToVendor: {
      type: Number,
    },
    marginValue: {
      type: Number,
    },
    marginPercentage: {
      type: Number,
    },
    currentStatus: {
      type: String,
    },
    actionPlan: {
      type: String,
    },
    remarks: {
        type: String
    },
    revisions: [
        {
             revisionNumber: {
                 type: String,
                 enum: ["R1", "R2", "R3", "R4", "R5"],
                 immutable: true
             },
             files: [String],
             comment: String,
             timestamp: {
                 type: Date,
                 default: Date.now
             }
         }
     ]
  },
  { timestamps: true }
);

const TradingProposal = new mongoose.model(
  "TradingProposal",
  tradingProposalSchema
);
module.exports = TradingProposal;
