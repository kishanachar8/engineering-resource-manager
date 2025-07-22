const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProjectById, updateProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getProjects);
router.post('/', authMiddleware, createProject);
router.get('/:id', authMiddleware, getProjectById);
router.put('/:id', authMiddleware,updateProject);
module.exports = router;