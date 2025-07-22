const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  startDate: Date,
  endDate: Date,
  requiredSkills: [String],
  teamSize: Number,
  status: { type: String, enum: ['planning', 'active', 'completed'] },
  managerId: mongoose.Schema.Types.ObjectId,
});
module.exports = mongoose.model('Project', ProjectSchema);