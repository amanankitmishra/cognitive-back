const mongoose = require("mongoose");

const tradingProposalNumberSchema = new mongoose.Schema({
    prefix: {
        type: String,
        required: true,
        unique: true,
      },
    startingNumber: {
        type: Number,
        required: true,
        default: 1
    },
    currentNumber: {
        type: Number
    },
    active: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

tradingProposalNumberSchema.methods.incrementCurrentNumber = async function () {
    this.currentNumber = this.currentNumber + 1;
    await this.save();
    return this.currentNumber;
};

tradingProposalNumberSchema.statics.getNextNumber = async function () {
    const activeDocument = await this.findOne({ active: true });

    if (activeDocument) {
        const updatedCurrentNumber = await activeDocument.incrementCurrentNumber();
        const activePrefix = activeDocument.prefix;
        const generatedNumber = activePrefix + updatedCurrentNumber;
        return generatedNumber;
    }

    return null;
};

const TradingProposalNumber = mongoose.model('TradingProposalNumber', tradingProposalNumberSchema)
module.exports= TradingProposalNumber;