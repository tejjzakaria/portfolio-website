const mongoose = require('mongoose');

const BillableHoursSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  billable: { type: Boolean, required: true },
  totalHours: { type: Number, required: true }, // decimal hours
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.models.BillableHours || mongoose.model('BillableHours', BillableHoursSchema);
