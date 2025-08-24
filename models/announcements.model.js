const mongoose = require('mongoose');

const AnnouncementsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  author: { type: String, required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementsSchema);
