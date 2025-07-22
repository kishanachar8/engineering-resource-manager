const User = require('../models/User');
const Assignment = require('../models/Assignment');

// ✅ Get all engineers (excluding passwords)
exports.getEngineers = async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' }).select('-password');
    res.json(engineers);
  } catch (err) {
    console.error("❌ Error fetching engineers:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// ✅ Get specific engineer's capacity
exports.getCapacity = async (req, res) => {
  try {
    const engineer = await User.findById(req.params.id).select('-password');
    if (!engineer || engineer.role !== 'engineer') {
      return res.status(404).json({ msg: 'Engineer not found' });
    }

    const assignments = await Assignment.find({ engineerId: engineer._id });

    const allocated = assignments.reduce(
      (acc, cur) => acc + cur.allocationPercentage,
      0
    );

    const available = engineer.maxCapacity - allocated;

    res.json({
      engineer: {
        id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        skills: engineer.skills,
        seniority: engineer.seniority,
        department: engineer.department,
        maxCapacity: engineer.maxCapacity
      },
      allocated,
      available
    });

  } catch (err) {
    console.error("❌ Error fetching capacity:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Get Profile Error:", err);
    res.status(500).json({ msg: 'Server error' });
  }
};