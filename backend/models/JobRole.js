import mongoose from 'mongoose';

const jobRoleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true },
  requiredSkills: [{ type: String }],
  description: { type: String, default: '' },
});

export default mongoose.model('JobRole', jobRoleSchema);
