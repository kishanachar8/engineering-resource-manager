const express = require('express');
const router = express.Router();
const {getEngineerAssignments, getAssignments, createAssignment, updateAssignment, deleteAssignment } = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAssignments);
router.post('/', authMiddleware, createAssignment);
router.put('/:id', authMiddleware, updateAssignment);
router.delete('/:id', authMiddleware, deleteAssignment);
router.get('/engineer/:id', getEngineerAssignments)

module.exports = router;
