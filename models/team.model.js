import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  avatar: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
  timestamps: true,
});

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
