const User = require("../models/User");

exports.getMetaData = (req, res) => {
  try {
    const departmentEnum = User.schema.path("department").enumValues;
    const skillsEnum = User.schema.path("skills").caster.enumValues;
    const roleEnum = User.schema.path("role").enumValues;
    const seniorityEnum = User.schema.path("seniority").enumValues;

    res.json({
      departments: departmentEnum,
      skills: skillsEnum,
      roles: roleEnum,
      seniorityLevels: seniorityEnum,
    });
  } catch (error) {
    console.error("Error fetching meta enums:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
