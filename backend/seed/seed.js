const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Project = require('../models/Project');
const Assignment = require('../models/Assignment');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected. Starting seed...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Assignment.deleteMany();

    // Create Users
    const manager = new User({
      name: 'Project Manager',
      email: 'manager@example.com',
      password: 'hashedpassword', // use bcrypt if needed
      role: 'manager',
      department: 'Engineering'
    });

    const engineer1 = new User({
      name: 'Alice Engineer',
      email: 'alice@example.com',
      password: 'hashedpassword',
      role: 'engineer',
      skills: ['React', 'Node.js'],
      seniority: 'mid',
      maxCapacity: 100,
      department: 'Frontend'
    });

    const engineer2 = new User({
      name: 'Bob Engineer',
      email: 'bob@example.com',
      password: 'hashedpassword',
      role: 'engineer',
      skills: ['MongoDB', 'Express'],
      seniority: 'senior',
      maxCapacity: 100,
      department: 'Backend'
    });

    await manager.save();
    await engineer1.save();
    await engineer2.save();

    // Create Project
    const project = new Project({
      name: 'Internal Dashboard',
      description: 'Build internal engineering dashboard',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      requiredSkills: ['React', 'Node.js'],
      teamSize: 2,
      status: 'active',
      managerId: manager._id
    });

    await project.save();

    // Create Assignments
    const assignment1 = new Assignment({
      engineerId: engineer1._id,
      projectId: project._id,
      allocationPercentage: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      role: 'Frontend Developer'
    });

    const assignment2 = new Assignment({
      engineerId: engineer2._id,
      projectId: project._id,
      allocationPercentage: 75,
      startDate: new Date(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      role: 'Backend Developer'
    });

    await assignment1.save();
    await assignment2.save();

    console.log('✅ Seeding complete');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Seeding failed', err);
    mongoose.connection.close();
  });
