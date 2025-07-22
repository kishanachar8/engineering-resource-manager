const Assignment = require('../models/Assignment');
const mongoose = require('mongoose');

exports.getAssignments = async (req, res) => {
 const assignments = await Assignment.find()
  .populate("engineerId", "name")  // only fetch name
  .populate("projectId", "name");

res.json(assignments);
};

exports.createAssignment = async (req, res) => {
  try {
    const { projectId, engineerId, allocationPercentage,startDate, endDate,role} = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ msg: "Invalid projectId" });
    }
    if (!mongoose.Types.ObjectId.isValid(engineerId)) {
      return res.status(400).json({ msg: "Invalid engineerId" });
    }

    const newAssignment = new Assignment({
      projectId,
      engineerId,
      allocationPercentage,
      startDate,
      endDate,
      role,
    });

    await newAssignment.save();
    res.status(201).json(newAssignment);
  } catch (err) {
    console.error("❌ ASSIGNMENT ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
}

exports.updateAssignment = async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(assignment);
};

exports.deleteAssignment = async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};

exports.getEngineerAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ engineerId: req.params.id }).populate('projectId')
    res.json(assignments)
  } catch (err) {
    console.error('❌ Error fetching engineer assignments:', err)
    res.status(500).json({ msg: 'Server Error' })
  }
}