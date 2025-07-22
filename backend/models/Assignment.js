const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  engineerId: mongoose.Schema.Types.ObjectId,
  projectId: mongoose.Schema.Types.ObjectId,
  allocationPercentage: Number,
  startDate: Date,
  endDate: Date,
  role: String,
});
module.exports = mongoose.model('Assignment', AssignmentSchema);
