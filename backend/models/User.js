import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'User' },
  skills: [{ type: String }],
  careerGoal: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
