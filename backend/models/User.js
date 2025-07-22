const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['engineer', 'manager'], required: true },
skills: [{ type: String,     enum: ["React", "Node.js", "TypeScript", "MongoDB", "Express", "Docker", "AWS", "Python","Machine Learning"], required: true }],
  seniority: { type: String, enum: ['junior', 'mid', 'senior'],required: true },
  maxCapacity: { type: Number,required: true, min: 0, max: 100 },
  department: { type: String,    enum: ["Frontend", "Backend", "Fullstack", "DevOps", "QA", "Data"], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
