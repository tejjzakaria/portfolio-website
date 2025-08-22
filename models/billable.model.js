const mongoose = require('mongoose');

const BillableSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  billable: { type: Boolean, required: true },
  totalHours: { type: Number, required: true }, // decimal hours
}, { timestamps: true });

module.exports = mongoose.models.Billable || mongoose.model('Billable', BillableSchema);
